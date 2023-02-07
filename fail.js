/*
 * 失败
 */
export default function fail(msg = '', data = null) {
    return {
        status: false,
        data: {
            msg,
            data,
        },
    }
}
