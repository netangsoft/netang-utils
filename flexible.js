(function flexible (window, document) {
    const { documentElement } = document

    function setRemUnit () {
        documentElement.style.fontSize = (documentElement.clientWidth > 562.5 ? 150 : documentElement.clientWidth / 3.75) + 'px'
    }

    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            setRemUnit()
        }
    })

    setRemUnit()
}(window, document))
