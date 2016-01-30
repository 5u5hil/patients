

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

    $("body").on("toggle",".muteMic",
            function () {
                console.log('false');
                $rootScope.publisher.setPublishAudio(false);
            }, function () {
        console.log('true');
        $rootScope.publisher.setPublishAudio(true);
    }
    );

 $("body").on("toggle",".muteSub",
            function () {
                console.log('false');
                $rootScope.subscriber.setSubscribeToAudio(false);
            }, function () {
        console.log('true');
        $rootScope.subscriber.setSubscribeToAudio(true);
    }
    );
});