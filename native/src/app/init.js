(function (w) {
    function init() {
        TT.native.init().done(init).fail(onError);
    };

    function onError() {

    };

    $(document).ready(function () {
        if (w.TT) {
            TT.native.init().done(function () {
                TT.api.get('/v1/me').done(function (response) {
                    w.__store = response;

                    angular.bootstrap(document, ['tt-boilerplate']);
                }).fail(function (response) {

                });
            }).fail(function () {

            });
        } else {
            throw new Error('Cannot start app, tt.js not loaded');
        }
    });
})(window);
