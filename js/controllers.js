
angular.module('your_app_name.controllers', [])

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if ($rootScope.userLogged == 0)
                $state.go('auth.login');
        })

// APP
        .controller('AppCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if ($rootScope.userLogged == 0)
                $state.go('auth.login');
        })

//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope) {
            $scope.doLogIn = function () {
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            //if ($rootScope.url != '') {
                            if (window.localStorage.getItem('url') != null) {
                                $state.go(window.localStorage.getItem('url'));
                            } else {
                                $state.go('app.category-list');
                            }
                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            //alert(response);
                        }
                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            $scope.user = {};
            $scope.user.email = "";
            $scope.user.pin = "";
            // We need this for the form validation
            $scope.selected_tab = "";
            $scope.$on('my-tabs-changed', function (event, data) {
                $scope.selected_tab = data.title;
            });
        })
        .controller('LogoutCtrl', function ($scope, $state, $templateCache, $q, $rootScope) {
            localStorage.clear();
            $rootScope.userLogged = 0;
            $rootScope.$digest;
            $state.go('auth.walkthrough');
            //window.location.href = "#/";
        })
        .controller('SignupCtrl', function ($scope, $state, $http, $rootScope) {
            $scope.user = {};
            $scope.user.name = '';
            $scope.user.email = '';
            $scope.user.phone = '';
            $scope.user.password = '';
            $scope.doSignUp = function () {
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password;
                //var data = new FormData(jQuery("#signup")[0]);
                $.ajax({
                    type: 'GET',
                    url: domain + "register",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        //console.log(response);
                        if (angular.isObject(response)) {
                            store(response);
                            $rootScope.userLogged = 1;
                            //if ($rootScope.url != '') {
                            if (window.localStorage.getItem('url') != null) {
                                $state.go(window.localStorage.getItem('url'));
                            } else {
                                $state.go('app.category-list');
                            }
                        } else {
                            alert('Please fill all the details for signup');
                        }
                        $rootScope.$digest;
                    },
                    error: function (e) {
                        console.log(e.responseText);
                    }
                });
            };
            //Check if email is already registered
            $scope.checkEmail = function (email) {
                $http({
                    method: 'GET',
                    url: domain + 'check-user-email',
                    params: {userEmail: email}
                }).then(function successCallback(response) {
                    if (response.data > 0) {
                        $scope.user.email = '';
                        $scope.emailError = "This email-id is already registered!";
                        $scope.emailError.digest;
                        //alert("This email-id already registered");
                    } else {
                        $scope.emailError = "";
                        $scope.emailError.digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state) {
            $scope.recoverPassword = function () {
                $state.go('app.feeds-categories');
            };

            $scope.user = {};
        })

        .controller('RateApp', function ($scope) {
            $scope.rateApp = function () {
                if (ionic.Platform.isIOS()) {
                    //you need to set your own ios app id
                    AppRate.preferences.storeAppURL.ios = '1234555553>';
                    AppRate.promptForRating(true);
                } else if (ionic.Platform.isAndroid()) {
                    //you need to set your own android app id
                    AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
                    AppRate.promptForRating(true);
                }
            };
        })

        .controller('SendMailCtrl', function ($scope) {
            $scope.sendMail = function () {
                cordova.plugins.email.isAvailable(
                        function (isAvailable) {
                            // alert('Service is not available') unless isAvailable;
                            cordova.plugins.email.open({
                                to: 'envato@startapplabs.com',
                                cc: 'hello@startapplabs.com',
                                // bcc:     ['john@doe.com', 'jane@doe.com'],
                                subject: 'Greetings',
                                body: 'How are you? Nice greetings from IonFullApp'
                            });
                        }
                );
            };
        })
        .controller('AdsCtrl', function ($scope, $http, $state, $ionicActionSheet, AdMob, iAd) {
            //$scope.cats = [];
            $scope.manageAdMob = function () {
                $http({
                    method: 'GET',
                    url: domain + 'records/get-record-categories',
                    params: {userId: $scope.userid}
                }).then(function successCallback(response) {
                    $scope.cats = [];
                    //console.log(response);
                    //$scope.categories = response.data; 
                    angular.forEach(response.data, function (value, key) {
                        //console.log(value.category);
                        $scope.cats.push({text: value.category, id: value.id});
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
                //console.log($scope.cats);
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons                    
                    buttons:
                            $scope.cats
                    ,
                    //destructiveText: 'Remove Ads',
                    titleText: 'Select the Category',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    destructiveButtonClicked: function () {
                        console.log("removing ads");
                        AdMob.removeAds();
                        return true;
                    },
                    buttonClicked: function (index, button) {
                        console.log(button.id);
                        AdMob.showBanner(button.id);
                        //window.location.href = "http://192.168.2.169:8100/#/app/add-category/" + button.id;
                        $state.go('app.add-category', {'id': button.id});
                        return true;
                    }
                });
            };
            $scope.manageiAd = function () {
                $http({
                    method: 'GET',
                    url: domain + 'records/get-record-categories'
                }).then(function successCallback(response) {
                    $scope.cats = [];
                    //console.log(response);
                    //$scope.categories = response.data; 
                    angular.forEach(response.data, function (value, key) {
                        //console.log(value.category);
                        $scope.cats.push({text: value.category, id: value.id});
                    });
                }, function errorCallback(response) {
                    console.log(response);
                });
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons
                    buttons: $scope.cats,
                    destructiveText: 'Remove Ads',
                    titleText: 'Choose the ad to show - Interstitial only works in iPad',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    destructiveButtonClicked: function () {
                        console.log("removing ads");
                        iAd.removeAds();
                        return true;
                    },
                    buttonClicked: function (index, button) {
                        if (button.text == 'Show iAd Banner')
                        {
                            console.log("show iAd banner");
                            iAd.showBanner();
                        }
                        if (button.text == 'Show iAd Interstitial')
                        {
                            console.log("show iAd interstitial");
                            iAd.showInterstitial();
                        }
                        return true;
                    }
                });
            };
        })

//bring specific category providers
        .controller('CategoryListCtrl', function ($scope, $http, $stateParams, $rootScope) {
            if (get('id') != null) {
                $rootScope.userLogged = 1;
            }
            //console.log($rootScope.userLogged);
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
        })

        .controller('CategoryDetailCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
            //console.log(get('id'));
            $scope.userid = get('id');
            $http({
                method: 'GET',
                url: domain + 'records/view-patient-record-category',
                params: {userId: $scope.userid}
            }).then(function successCallback(response) {
                //console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.userRecords = response.data.recordCount;
            }, function errorCallback(response) {
                console.log(response);
            });
        })

        .controller('AddRecordCtrl', function ($scope, $http, $state, $stateParams, $sce, $compile) {
            $scope.userId = get('id');
            $scope.categoryId = $stateParams.id;
            $scope.fields = [];
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                $scope.fields = response.data;
                //angular.forEach(response.data, function (value, key) {
                //    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                //});
                $scope.category = $stateParams.id;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.addNewElement = function (ele) {
                //console.log('text' + ele);
                addNew(ele);
            };
            $scope.submit = function () {
                var data = new FormData(jQuery("#addrecords")[0]);
                callAjax("POST", domain + "records/save", data, function (response) {
                    console.log(response);
                    if (angular.isObject(response)) {
                        $state.go('app.records-view', {'id': $scope.categoryId});
                        //window.location.href = "http://192.168.2.169:8100/#/app/records-view/" + $scope.categoryId;
                    }
                });

            };

        })
        .controller('EditRecordCtrl', function ($scope, $http, $state, $stateParams, $sce) {
            $scope.fields = [];
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.cat}
            }).then(function successCallback(response) {
                $scope.fields.push($sce.trustAsHtml("<input type='hidden' ng-model='record.recordId' value='" + $stateParams.id + "' name='recordId' /><input type='hidden' ng-model='record.recordCat' value='" + $stateParams.cat + "' name='recordCat' />"));
                angular.forEach(response.data, function (value, key) {
                    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                });
                //var modelname = '';
                $http({
                    method: "GET",
                    url: domain + "records/get-record-value",
                    params: {id: $stateParams.id}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    angular.forEach(response.data, function (value, key) {
                        //console.log(value.field_id + ' : ' + value.value + '-------' + key);
                        modelname = value.field_id;
                        if (!$scope.$$phase) {
                            $timeout(function () {
                                $scope.$apply(function () {
                                    //wrapped this within $apply
                                    $scope.modelname = value.value;
                                    console.log('message:' + $scope.modelname);
                                });
                            }, 0);
                        }
                    });
                }, function errorCallback(e) {
                    console.log(e.responseText);
                });
                //console.log($scope.fields);
            }, function errorCallback(response) {
                console.log(response);
            });
        })


        .controller('RecordsViewCtrl', function ($scope, $http, $stateParams) {
            $scope.record = {recordId: ''};
            $scope.record.ids = [];
            $scope.limit = 4;
            $scope.userId = get('id');
            $http({
                method: 'POST',
                url: domain + 'records/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId}
            }).then(function successCallback(response) {
                //console.log(response.data);
                $scope.records = response.data;
                //$ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });

        })
        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams) {
            $scope.recordId = $stateParams.id;
            $http({
                method: 'POST',
                url: domain + 'records/get-record-details',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                //console.log(response);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                //$ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                //console.log(id);
                //$ionicLoading.show({ template: 'Loading...' });
                $http({
                    method: 'POST',
                    url: domain + 'records/delete',
                    params: {id: id}
                }).then(function successCallback(response) {
                    //$ionicLoading.hide();
                    //console.log(response);
                    $state.go('app.category-detail');
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            //EDIT Modal
            $scope.edit = function (id, cat) {
                $state.go('app.edit-record', {'id': id, 'cat': cat});
                //window.location.href = "http://192.168.2.169:8100/#/app/edit-record/" + id + "/" + cat;
            };
        })
        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams) {
            $scope.specializations = {};
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations',
                params: {userId: $scope.userId}
            }).then(function successCallback(response) {
                //$ionicLoading.hide();
                //console.log(response.data);
                $scope.specializations = response.data.spec;
                $scope.video_app = response.data.video_app;
                $scope.doctorsData = response.data.doctorsData;
                $scope.products = response.data.products;
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });
        })
        .controller('ConsultationCardsCtrl', function ($scope, $http, $stateParams) {
            $scope.specId = $stateParams.id;
            $scope.userId = get('id');
            $scope.docServices = [];
            $http({
                method: 'GET',
                url: domain + 'doctors/list',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                //$ionicLoading.hide();
                $scope.doctors = response.data.user;
                angular.forEach($scope.doctors, function (value, key) {
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctor-services',
                        params: {id: value.id}
                    }).then(function successCallback(responseData) {
                        //$ionicLoading.hide();
                        $scope.docServices[key] = responseData.data;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                    $scope.spec = response.data.spec;
                });
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('ConsultationProfileCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $filter) {
            $scope.vSch = [];
            $scope.schV = [];
            $scope.cSch = [];
            $scope.schC = [];
            $scope.hSch = [];
            $scope.schH = [];
            $scope.bookingSlot = '';
            $scope.supId = '';
            $http({
                method: 'GET',
                url: domain + 'doctors/get-details',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.doctor = response.data.user;
                $scope.videoProd = response.data.video_product;
                $scope.videoInc = response.data.video_inclusions;
                $scope.videoSch = response.data.videoSch;
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.homeProd = response.data.home_product;
                $scope.homeInc = response.data.home_inclusions;
                $scope.homeSch = response.data.homeSch;
                $scope.clinicProd = response.data.clinic_product;
                $scope.clinicInc = response.data.clinic_inclusions;
                $scope.clinicSch = response.data.clinicSch;
                $scope.packages = response.data.packages;
                $scope.services = response.data.services;
                //$ionicLoading.hide();
                angular.forEach($scope.videoSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: from}
                    }).then(function successCallback(responseData) {
                        //$ionicLoading.hide();
                        $scope.vSch[key] = responseData.data.slots;
                        $scope.schV[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate = tomorrow;

                        } else {
                            $scope.schdate = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });

                    //console.log($scope.vSch);
                });
                //console.log($scope.videoSch);
                angular.forEach($scope.clinicSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: new Date()}
                    }).then(function successCallback(responseData) {
                        //console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.cSch[key] = responseData.data.slots;
                        $scope.schC[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schCdate = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate = tomorrow;

                        } else {
                            $scope.schCdate = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                angular.forEach($scope.homeSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: new Date()}
                    }).then(function successCallback(responseData) {
                        //console.log(responseData.data);
                        //$ionicLoading.hide();
                        $scope.hSch[key] = responseData.data.slots;
                        $scope.schH[key] = supsassId;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                //$scope.$digest();
                //console.log(response);
            });
            $scope.getNextSlots = function (nextDate, supsassId, key) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd HH:mm:ss');
                //$ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    //cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    console.log(responseData.data.slots);
                    //$ionicLoading.hide();
                    $scope.vSch[key] = responseData.data.slots;
                    if (responseData.data.lastdate == '')
                    {
                        $scope.schdate = new Date();
                        $scope.nextdate = new Date();

                    } else {
                        $scope.schdate = new Date(responseData.data.lastdate);
                        var tomorrow = new Date(responseData.data.lastdate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                    }
                    //$scope.$digest();
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key) {
                var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    console.log(responseData);
                    //$ionicLoading.hide();
                    $scope.vSch[key] = responseData.data.slots;
                    $scope.schdate = new Date(responseData.data.lastdate);
                    var tomorrow = new Date(responseData.data.lastdate);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    $scope.nextdate = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.bookSlot = function (starttime, endtime, supid) {
                console.log(starttime + '===' + supid);
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
            };
            $scope.bookAppointment = function (prodId) {
                //console.log($scope.bookingSlot);
                if ($scope.bookingStart) {
                    window.localStorage.setItem('supid', $scope.supId);
                    window.localStorage.setItem('startSlot', $scope.bookingStart);
                    window.localStorage.setItem('endSlot', $scope.bookingEnd);
                    window.localStorage.setItem('prodid', prodId);
                    window.localStorage.setItem('url', 'app.payment');
                    $rootScope.supid = $scope.supId;
                    $rootScope.startSlot = $scope.bookingStart;
                    $rootScope.endSlot = $scope.bookingEnd;
                    $rootScope.prodid = prodId;
                    $rootScope.url = 'app.payment';
                    $rootScope.$digest;
                    if (checkLogin())
                        $state.go('app.payment');
                    else
                        $state.go('auth.login');
                } else {
                    alert('Please select slot');
                }
            };
        })

        .controller('PaymentCtrl', function ($scope, $http, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $cordovaInAppBrowser) {
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodid');
            //console.log(supid + '--' + slot + '---' + prodid);
            $http({
                method: 'GET',
                url: domain + 'doctors/get-order-review',
                params: {id: $scope.supid, prodId: $scope.prodid}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.payNow = function () {
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                //console.log($scope.prodid + '--' + $scope.userId);
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    console.log(response);
                    //$ionicLoading.hide();
                    var href = response.data; //'http://infinisystem.com/';
                    var options = {
                        location: 'yes',
                        clearcache: 'yes',
                        toolbar: 'yes'
                    };
                    $cordovaInAppBrowser.open(href, '_self', options)
                            .then(function (e) {
                                console.log('successfully load');
                                // success
                            })
                            .catch(function (e) {
                                // error
                            });
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('SuccessCtrl', function ($scope, $http, $stateParams) {
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $http({
                method: 'GET',
                url: domain + 'orders/get-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.appointment = responseData.data.appointment;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('slot');
            window.localStorage.removeItem('prodid');
        })

        .controller('FailureCtrl', function ($scope, $http, $stateParams) {
            //$scope.slot = window.localStorage.getItem('slot');
            $http({
                method: 'GET',
                url: domain + 'orders/get-failure-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('slot');
            window.localStorage.removeItem('prodid');
        })
        .controller('CurrentTabCtrl', function ($scope, $http, $stateParams) {
            $scope.appId = $stateParams.id;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-app-details',
                params: {id: $scope.appId, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.app = response.data.app;
                $scope.doctor = response.data.doctorsData;
                $scope.products = response.data.products;

            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('PatientJoinCtrl', function ($scope, $http, $stateParams, $sce) {
            $scope.appId = $stateParams.id;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'appointment/join-doctor',
                params: {id: $scope.appId, userId: $scope.userId}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45463682';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                var token = response.data.oToken;
                var session = OT.initSession(apiKey, sessionId);
                session.on({
                    streamCreated: function (event) {
                        session.subscribe(event.stream, 'subscribersDiv', {width: "100%", height: "100%"});
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        console.log(error.message);
                    } else {
                        session.publish('myPublisherDiv', {width: "30%", height: "30%"});
                    }
                });

            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            }
        })
        ;
