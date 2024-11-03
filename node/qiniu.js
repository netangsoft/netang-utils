import axios from 'axios'
import _qiniu from 'qiniu'

import $n_has from 'lodash/has.js'

import $n_slash from '../slash.js'
import $n_isValidArray from '../isValidArray.js'
import $n_isValidString from '../isValidString.js'
import $n_sortDesc from '../sortDesc.js'

import readdir from './readdir.js'
import remove from './remove.js'

/**
 * 七牛类
 */
class QN {

    /**
     * 构造
     */
    constructor(config) {

        // 配置
        this.config = Object.assign({
            // 公钥
            accessKey: '',
            // 私钥
            secretKey: '',
            // 空间
            bucket: '',
            // 公共空间域名
            domain: '',
            // 前缀
            prefix: '',
            // 地区(华东)
            zone: 'Zone_z0',
            // 上传地址
            uphost: 'up-cn-east-2.qiniup.com',
        }, config)

        // 七牛鉴权认证
        this.auth = null

        // 七牛配置
        this.qiniuConfig = null

        // 空间管理
        this.bucketManager = null
    }

    /**
     * 上传文件
     */
    upload(filePath, fileUrl, bucket) {
        return new Promise((resolve, reject) => {

            if (! filePath || ! fileUrl) {
                reject('文件路径不存在')
                return
            }

            if (! bucket) {
                bucket = this.config.bucket
            }

            if (! bucket) {
                reject('空间不存在')
                return
            }

            // 获取鉴权
            this._getAuth()

            // 获取七牛配置
            this._getQiniuConfig()

            const uploadToken = new _qiniu.rs.PutPolicy({
                scope: bucket,
            }).uploadToken(this.auth)

            const formUploader = new _qiniu.form_up.FormUploader(this.qiniuConfig)

            const putExtra = new _qiniu.form_up.PutExtra()

            // 文件上传
            formUploader.putFile(uploadToken, fileUrl, filePath, putExtra, (err, respBody, { statusCode }) => {

                if (err) {
                    reject(err)
                    return
                }

                if (Number(statusCode) !== 200) {
                    console.log('[file]' + fileUrl)
                    reject(respBody)
                    return
                }

                resolve(true)
            })

        })
    }

    /**
     * 上传字符串
     */
    uploadString(fileUrl, content, bucket) {
        return new Promise((resolve, reject) => {

            if (! fileUrl || ! $n_isValidString(content)) {
                reject('文件路径或上传内容不存在')
                return
            }

            if (! bucket) {
                bucket = this.config.bucket
            }

            if (! bucket) {
                reject('空间不存在')
                return
            }

            // 获取鉴权
            this._getAuth()

            // 获取七牛配置
            this._getQiniuConfig()

            const uploadToken = new _qiniu.rs.PutPolicy({
                scope: bucket,
            }).uploadToken(this.auth)

            const formUploader = new _qiniu.form_up.FormUploader(this.qiniuConfig)

            const putExtra = new _qiniu.form_up.PutExtra()

            // 字节数组上传
            formUploader.put(uploadToken, fileUrl, content, putExtra, (err, respBody, { statusCode }) => {

                if (err) {
                    reject(err)
                    return
                }

                if (Number(statusCode) !== 200) {
                    console.log('[file]' + fileUrl)
                    reject(respBody)
                    return
                }

                resolve(true)
            })
        })
    }

    /**
     * 删除文件
     */
    delete(fileUrl, bucket) {
        return new Promise((resolve, reject) => {

            if (! fileUrl) {
                reject('文件路径不存在')
                return
            }

            if (! bucket) {
                bucket = this.config.bucket
            }

            if (! bucket) {
                reject('空间不存在')
                return
            }

            // 获取空间管理
            this._getBucketManager()

            // 如果是数组, 则为批量删除
            if (Array.isArray(fileUrl)) {

                if (! fileUrl.length) {
                    reject('文件路径不存在')
                    return
                }

                const deleteOperations = []
                for (const url of fileUrl) {
                    deleteOperations.push(_qiniu.rs.deleteOp(bucket, url))
                }
                this.bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {
                    if (err) {
                        console.log('[file]' + fileUrl)
                        reject(err)
                        return
                    }
                    resolve(true)
                })
                return
            }

            // 否则删除单个
            this.bucketManager.delete(bucket, fileUrl, (err) => {
                if (err) {
                    console.log('[file]' + fileUrl)
                    reject(err)
                    return
                }

                resolve(true)
            })
        })
    }

    /**
     * 获取文件列表
     * $prefix    获取文件前缀
     * $limit     获取文件数量
     * $marker    上次列举返回的位置标记, 作为本次列举的起点信息
     */
    getFileLists(bucket = null, prefix = '', limit = 10000) {

        return new Promise((resolve, reject) => {

            if (! bucket) {
                bucket = this.config.bucket
            }

            if (! bucket) {
                reject('空间不存在')
                return
            }

            if (! prefix) {
                prefix = this.config.prefix
            }

            // 获取空间管理
            this._getBucketManager()

            // @param options 列举操作的可选参数
            //        prefix    列举的文件前缀
            //        marker    上一次列举返回的位置标记，作为本次列举的起点信息
            //        limit     每次返回的最大列举文件数量
            //        delimiter 指定目录分隔符
            const options = {
                limit,
                prefix,
            }

            this.bucketManager.listPrefix(bucket, options, (err, respBody, { statusCode }) => {

                if (err) {
                    reject(err)
                    return
                }

                if (Number(statusCode) !== 200) {
                    reject(respBody)
                    return
                }

                // 如果这个 nextMarker 不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
                // 指定options里面的marker为这个值
                // const nextMarker = respBody.marker
                // const commonPrefixes = respBody.commonPrefixes

                resolve(respBody.items)
            })
        })
    }

    /**
     * 上传本地文件
     */
    async uploadLocal(params) {

        const {
            localPath,
            ignoreUpload,
            manifest,
            manifestPrefix,
            manifestLimit,
            isRemoveLocal,
            ignoreRemove,

        } = Object.assign({
            // 本地上传路径
            localPath: '',
            // 忽略上传规则
            ignoreUpload: [],
            // 是否开启资源 json
            manifest: false,
            // 资源 json 前缀
            manifestPrefix: 'media.manifest',
            // 资源限制数量(只保留 media.manifest.xxx.json 的数量)
            manifestLimit: 5,
            // 上传完成后是否删除本地文件
            isRemoveLocal: false,
            // 忽略删除规则
            ignoreRemove: [],
        }, params)

        // 上传本地资源文件
        const uploadCdnFileLists = []
        const localLists = await readdir(localPath, {
            // 忽略规则
            ignores: ignoreUpload,
        })
        for (const { filePath, fileName, isFile } of localLists) {
            if (isFile) {
                const fileUrl = $n_slash(this.config.prefix, 'all', false) + $n_slash(filePath.replace(localPath, '').replace(/\\/g, '/'), 'start', true)
                uploadCdnFileLists.push(fileUrl)

                // 上传本地资源文件
                await this.upload(filePath, fileUrl)
            }
        }

        // 如果有上传列表
        if (manifest && uploadCdnFileLists.length) {

            const md5All = {}
            const manifestLists = []
            const manifestJsonPrefix = this.config.prefix + manifestPrefix + '.'

            // 获取 media.manifest.xxx.json
            const currentManifestLists = await this.getFileLists(null, manifestJsonPrefix)

            // 将资源上传至 media.manifest.xxx.json 文件
            await this.uploadString(manifestJsonPrefix + `${new Date().getTime()}.json`, JSON.stringify(uploadCdnFileLists))

            // 去除相同 md5 的 media.manifest.xxx.json 文件
            for (const item of currentManifestLists) {

                // 如果有相同的 md5(说明有重复的 json), 则直接从 cdn 删除该 json
                if ($n_has(md5All, item.md5)) {
                    console.log(`------删除 cdn 中的重复文件 [${item.key}]`)
                    await this.delete(item.key)

                } else {
                    // 设置 md5 all (防止重复)
                    md5All[item.md5] = 1

                    // 时间戳
                    item._time = Number(item.key.replace(manifestJsonPrefix, '').replace('.json', ''))

                    manifestLists.push(item)
                }
            }

            // 如果剩下的 media.manifest.xxx.json 数量 > 5 个, 则删除旧的
            if (manifestLists.length > manifestLimit) {

                // 按照时间戳从新到旧排列
                $n_sortDesc(manifestLists, '_time')

                for (let i = 0; i < manifestLists.length; i++) {
                    const item = manifestLists[i]

                    // 读取 json 内容
                    const { data } = await axios.get(this.config.domain + item.key)
                    if ($n_isValidArray(data)) {
                        for (const key of data) {

                            // 如果 key 不在已上传的资源中
                            if (uploadCdnFileLists.indexOf(key) === -1) {

                                // 如果在不需要删除的 json 中
                                if (i < manifestLimit) {
                                    uploadCdnFileLists.push(key)

                                // 否则删除资源
                                } else {
                                    console.log(`------删除 cdn [${item.key}] 中的旧文件 ${key}`)
                                    await this.delete(key)
                                }
                            }
                        }
                    }

                    // 删除旧的 json
                    if (i >= manifestLimit) {
                        console.log(`------删除 cdn 中的旧文件 [${item.key}]`)
                        await this.delete(item.key)
                    }
                }
            }
        }

        // 删除本地文件
        if (isRemoveLocal) {

            console.log('------删除本地文件')
            await remove(localPath, {
                // 不包含当前路径
                self: false,
                // 忽略规则
                ignores: ignoreRemove,
            })
        }
    }

    /**
     * 获取鉴权
     */
    _getAuth() {
        if (! this.auth) {
            this.auth = new _qiniu.auth.digest.Mac(this.config.accessKey, this.config.secretKey)
        }
    }

    /**
     * 获取七牛配置
     */
    _getQiniuConfig() {
        if (! this.qiniuConfig) {
            const config = new _qiniu.conf.Config()
            // config.useHttpsDomain = true
            config.zone = _qiniu.zone[this.config.zone]
            if (this.config.uphost) {
                config.zone.srcUpHosts = [this.config.uphost]
            }
            this.qiniuConfig = config
        }
    }

    /**
     * 获取空间管理
     */
    _getBucketManager() {
        if (! this.bucketManager) {

            // 获取鉴权
            this._getAuth()

            // 获取七牛配置
            this._getQiniuConfig()

            this.bucketManager = new _qiniu.rs.BucketManager(this.auth, this.qiniuConfig)
        }
    }
}

function qiniu(config) {
    return new QN(config)
}

export default qiniu
