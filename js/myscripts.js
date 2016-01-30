

$(document).ready(function () {


    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');

    if (get('id') != null) {
        $rootScope.$apply(function () {
            $rootScope.userLogged = 1;
            window.location.href = "#/app/category-listing";
        });
    } else {
        $rootScope.$apply(function () {
            $rootScope.userLogged = 0;
        });
    }

    $(".muteMic").toggle(
            function () {
                $rootScope.publisher.setPublishAudio(false);
            }, function () {
        $rootScope.publisher.setPublishAudio(true);
    }
    );


    $(".muteSub").toggle(
            function () {
                $rootScope.subscriber.setSubscribeToAudio(false);
            }, function () {
        $rootScope.subscriber.setSubscribeToAudio(true);
    }
    );
});