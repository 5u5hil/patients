var publisher;
var subscriber;

angular.module('your_app_name.controllers', [])

        .run(function ($rootScope, $templateCache) {
            $rootScope.$on('$viewContentLoaded', function () {
                $templateCache.removeAll();
            });
        })

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.login');
            }
        })

// APP
        .controller('AppCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.login');
            }
        })

        .controller('SearchBarCtrl', function ($scope, $state, $ionicConfig, $rootScope) {

        })




//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $ionicLoading) {
            $scope.doLogIn = function () {
                $ionicLoading.show({template: 'Loading...'});
                var data = new FormData(jQuery("#loginuser")[0]);
                $.ajax({
                    type: 'POST',
                    url: domain + "chk-user",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            $rootScope.username = response.fname;
                            //if ($rootScope.url != '') {
                            /*if (window.localStorage.getItem('url') != null) {
                             $state.go(window.localStorage.getItem('url'));
                             } else {*/
                            $state.go('app.category-list', {}, {reload: true});
                            //}
                        } else {
                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            //alert(response);
                        }
                        $rootScope.$digest;
                        $ionicLoading.hide();
                    },
                    error: function (e) {
                        $ionicLoading.hide();
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
            window.localStorage.clear();
            $rootScope.userLogged = 0;
            $rootScope.$digest;
            $state.go('auth.login', {}, {reload: true});
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
                    url: domain + "check-otp",
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        window.localStorage.setItem('code', response.otpcode);
                        store($scope.user);
                        alert('Kindly check your mobile for OTP')
                        $state.go('auth.check-otp', {}, {reload: true});
                        //window.location.href = "#/auth/check-otp";
                    }
                });
            };
            //check OTP
            $scope.checkOTP = function (otp) {
                $ionicLoading.show({template: 'Loading...'});
                $scope.user = {};
                $scope.user.name = window.localStorage.getItem('name');
                $scope.user.email = window.localStorage.getItem('email');
                $scope.user.phone = window.localStorage.getItem('phone');
                $scope.user.password = window.localStorage.getItem('password');
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password;
                var code = window.localStorage.getItem('code');
                console.log('data:---' + data);
                // console.log(window.localStorage.getItem('code'));
                if (parseInt(code) === parseInt(otp)) {
                    //  alert('success');
                    $.ajax({
                        type: 'GET',
                        url: domain + "register",
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            $ionicLoading.hide();
                            if (angular.isObject(response)) {
                                store(response);
                                $rootScope.userLogged = 1;
                                //if ($rootScope.url != '') {
//                                if (window.localStorage.getItem('url') != null) {
//                                    $state.go(window.localStorage.getItem('url'));
//                                } else {
                                alert('Your sucessfully registered');
                                $state.go('app.category-list', {}, {reload: true});
                                //}
                            } else {
                                alert('Please fill all the details for signup');
                            }
                            $rootScope.$digest;
                        },
                        error: function (e) {
                            $ionicLoading.hide();
                            console.log(e.responseText);
                        }
                    });
                }

            }
            //Check if email is already registered
            $scope.checkEmail = function (email) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'check-user-email',
                    params: {userEmail: email}
                }).then(function successCallback(response) {
                    $ionicLoading.hide();
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
                    $ionicLoading.hide();
                    console.log(response);
                });
            };
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state, $ionicLoading) {

            $scope.recoverPassword = function (email, phone) {
                $ionicLoading.show({template: 'Loading...'});
                window.localStorage.setItem('email', email);
                console.log("email:  " + email);
                $.ajax({
                    type: 'GET',
                    url: domain + "recovery-password",
                    data: {email: email, phone: phone},
                    cache: false,
                    success: function (response) {
                        $ionicLoading.hide();
                        window.localStorage.setItem('passcode', response.passcode);
                        $state.go('auth.update-password', {}, {reload: true});
                        //window.location.href = '#/auth/update-password';
                    }
                });
            };
            $scope.updatePassword = function (passcode, password, cpassword) {
                $ionicLoading.show({template: 'Loading...'});
                var email = window.localStorage.getItem('email');
                // console.log("email: "+email);
                $.ajax({
                    type: 'GET',
                    url: domain + "update-password",
                    data: {passcode: passcode, password: password, cpassword: cpassword, email: email},
                    cache: false,
                    success: function (response) {
                        console.log("#######" + passcode);
                        console.log("@@@@" + window.localStorage.getItem('passcode'));
                        if (response == 1) {

                            if (parseInt(passcode) == parseInt(window.localStorage.getItem('passcode'))) {
                                alert('Please login with your new password.');
                                $state.go('auth.login', {}, {reload: true});
                            } else {
                                alert('Please enter valid OTP.');
                            }

                        } else if (response == 2) {
                            alert('Password Mismatch.');
                        } else {
                            alert('Oops something went wrong.');
                        }
                        $ionicLoading.hide();
                    }
                });
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
            $scope.manageAdMob = function () {
                // Show the action sheet
                var hideSheet = $ionicActionSheet.show({
                    //Here you can add some more buttons                    
                    buttons: $scope.cats,
                    //destructiveText: 'Remove Ads',
                    titleText: 'Select the Category',
                    cancelText: 'Cancel',
                    cancel: function () {
                        // add cancel code..
                    },
                    destructiveButtonClicked: function () {
                        console.log("removing ads");
                        //AdMob.removeAds();
                        return true;
                    },
                    buttonClicked: function (index, button) {
                        console.log(button.id);
                        //AdMob.showBanner(button.id);
                        //window.location.href = "http://192.168.2.169:8100/#/app/add-category/" + button.id;
                        $state.go('app.add-category', {'id': button.id}, {reload: true});
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

        .controller('CategoryDetailCtrl', function ($scope, $http, $stateParams, $ionicFilterBar) {
            var filterBarInstance;
            // function getItems () {
            // var items = [];
            // for (var x = 1; x < 2000; x++) {
            // items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
            // }
            // $scope.items = items;
            // }

            // getItems();

            $scope.showFilterBar = function () {
                filterBarInstance = $ionicFilterBar.show({
                    items: $scope.items,
                    update: function (filteredItems, filterText) {
                        $scope.items = filteredItems;
                        if (filterText) {
                            console.log(filterText);
                        }
                    }
                });
            };
            $scope.refreshItems = function () {
                if (filterBarInstance) {
                    filterBarInstance();
                    filterBarInstance = null;
                }

                $timeout(function () {
                    getItems();
                    $scope.$broadcast('scroll.refreshComplete');
                }, 1000);
            };
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

        .controller('AddRecordCtrl', function ($scope, $http, $state, $stateParams, $compile, $filter) {
            $scope.curTime = $filter('date')(new Date(), 'MM/dd/yyyy');
            $scope.userId = get('id');
            $scope.categoryId = $stateParams.id;
            $scope.fields = {};
            $scope.problems = {};
            $scope.doctrs = {};
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.id, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                //angular.forEach(response.data, function (value, key) {
                //    $scope.fields.push($sce.trustAsHtml(createElement(value)));
                //});
                $scope.category = $stateParams.id;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
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

        .controller('ThankyouCtrl', function ($scope, $http, $stateParams) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;
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
            $scope.catId = $stateParams.id;
            $scope.limit = 4;
            $scope.userId = get('id');
            $http({
                method: 'GET',
                url: domain + 'records/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data.records;
                $scope.category = response.data.category;
                $scope.category.category = $stateParams.id;
                //$ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getRecords = function (cat) {
                console.log(cat);
            };
        })

        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams) {
            $scope.recordId = $stateParams.id;
            $http({
                method: 'POST',
                url: domain + 'records/get-record-details',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                $scope.problem = response.data.problem;
                $scope.doctrs = response.data.doctrs;
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

        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations',
                params: {userId: $scope.userId}
            }).then(function successCallback(response) {
                $ionicLoading.hide();
                console.log(response.data);
                $scope.specializations = response.data.spec;
                //Video
                $scope.video_time = response.data.video_time;
                $scope.video_app = response.data.video_app;
                $scope.video_doctorsData = response.data.video_doctorsData;
                $scope.video_products = response.data.video_products;
                $scope.video_end_time = response.data.video_end_time;
                //Clinic
                $scope.clinic_app = response.data.clinic_app;
                $scope.clinic_doctorsData = response.data.clinic_doctorsData;
                $scope.clinic_products = response.data.clinic_products;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.cancelAppointment = function (appId, drId, mode, startTime) {
                $scope.appId = appId;
                $scope.userId = get('id');
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                            $state.go('app.consultations-list', {}, {reload: true});
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                } else {
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/cancel-app',
                        params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                        $state.go('app.consultations-list');
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            };
            $scope.reschedule = function (appId, drId, mode, startTime) {
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    alert("Appointment can not be reschedule now!");
                } else if (timeDiff > 15) {
                    if (mode == 1) {
                        if (timeDiff < 60) {
                            alert("Appointment can not be reschedule now!");
                        } else {
                            window.localStorage.setItem('appId', appId);
                            $state.go('app.reschedule-appointment', {'id': drId});
                        }
                    } else {
                        window.localStorage.setItem('appId', appId);
                        $state.go('app.reschedule-appointment', {'id': drId});
                    }
                }
            };
            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
        })

        .controller('ConsultationCardsCtrl', function ($scope, $http, $stateParams, $ionicLoading) {
            $ionicLoading.show({template: 'Loading...'});
            $scope.specId = $stateParams.id;
            $scope.userId = get('id');
            $scope.docServices = [];
            $http({
                method: 'GET',
                url: domain + 'doctors/list',
                params: {id: $stateParams.id}
            }).then(function successCallback(response) {
                $ionicLoading.hide();
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

        .controller('ConsultationProfileCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $filter, $ionicLoading, $timeout) {
            $scope.IsVisible = false;
            //$ionicLoading.show({ template: 'Loading...' });
            $scope.counter = 100;
            var stopped;
            $scope.countdown = function () {
                $scope.IsVisible = true;
                stopped = $timeout(function () {
                    console.log($scope.counter);
                    $scope.counter--;
                    $scope.countdown();
                }, 1000);
                if ($scope.counter == 0) {
                    $scope.IsVisible = false;
                    $timeout.cancel(stopped);
                }
            };
            $scope.hidediv = function () {
                $scope.IsVisible = false;
                $timeout.cancel(stopped);
                $scope.counter = 100;
            };
            $scope.vSch = [];
            $scope.schV = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.cSch = [];
            $scope.schC = [];
            $scope.schCdate = [];
            $scope.nextCdate = [];
            $scope.hSch = [];
            $scope.schH = [];
            $scope.schHdate = [];
            $scope.nextHdate = [];
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
                $scope.instVideo = response.data.inst_video;
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
                $scope.chatProd = response.data.chat_product;
                $scope.chatInc = response.data.chat_inclusions;
                $scope.packages = response.data.packages;
                $scope.services = response.data.services;
                //$ionicLoading.hide();
                angular.forEach($scope.videoSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.vSch[key] = responseData.data.slots;
                        $scope.schV[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = tomorrow;
                        } else {
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                angular.forEach($scope.clinicSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.cSch[key] = responseData.data.slots;
                        $scope.schC[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = tomorrow;
                        } else {
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
                angular.forEach($scope.homeSch, function (value, key) {
                    var supsassId = value.supersaas_id
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.hSch[key] = responseData.data.slots;
                        $scope.schH[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = tomorrow;
                        } else {
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                });
            });
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    $ionicLoading.hide();
                    if (responseData.data.lastdate == '')
                    {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            $scope.nextdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            $scope.nextCdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            $scope.nextHdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }

                    } else {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 4) {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key, serv) {
                //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                }).then(function successCallback(responseData) {
                    $ionicLoading.hide();
                    if (serv == 1) {
                        if (responseData.data.slots == '') {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 3) {
                        if (responseData.data.slots == '') {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.cSch[key] = responseData.data.slots;
                            $scope.schCdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextCdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    } else if (serv == 4) {
                        if (responseData.data.slots == '') {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        } else {
                            $scope.hSch[key] = responseData.data.slots;
                            $scope.schHdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextHdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.bookSlot = function (starttime, endtime, supid) {
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
            };
            $scope.bookAppointment = function (prodId, serv) {
                console.log($scope.bookingStart);
                if ($scope.bookingStart) {
                    window.localStorage.setItem('supid', $scope.supId);
                    window.localStorage.setItem('startSlot', $scope.bookingStart);
                    window.localStorage.setItem('endSlot', $scope.bookingEnd);
                    window.localStorage.setItem('prodid', prodId);
                    //window.localStorage.setItem('url', 'app.payment');
                    window.localStorage.setItem('mode', serv);
                    $rootScope.supid = $scope.supId;
                    $rootScope.startSlot = $scope.bookingStart;
                    $rootScope.endSlot = $scope.bookingEnd;
                    $rootScope.prodid = prodId;
                    $rootScope.url = 'app.payment';
                    $rootScope.$digest;
                    if (serv == 1) {
                        if (checkLogin())
                            $state.go('app.payment');
                        else
                            $state.go('auth.login');
                    } else if (serv == 3 || serv == 4) {
                        if (checkLogin())
                            $state.go('app.payment');
                        else
                            $state.go('auth.login');
                    }
                } else {
                    alert('Please select slot');
                }
            };
            $scope.bookChatAppointment = function (prodId, serv) {
                window.localStorage.setItem('prodid', prodId);
                //window.localStorage.setItem('url', 'app.payment');
                window.localStorage.setItem('mode', serv);
                $rootScope.prodid = prodId;
                $rootScope.url = 'app.payment';
                if (checkLogin())
                    $state.go('app.payment');
                else
                    $state.go('auth.login');
            };
        })

        .controller('PaymentCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicLoading, $ionicGesture, $timeout, $ionicHistory) {
            $scope.mode = window.localStorage.getItem('mode');
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodid');
            $scope.apply = '';
            $scope.ccode = '';
            $scope.discountApplied = "";
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
            $scope.bookNow = function () {
//                $ionicHistory.nextViewOptions({
//                    disableBack: true
//                });
                $ionicLoading.show({template: 'Loading...'});
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $http({
                    method: 'GET',
                    url: domain + 'buy/book-appointment',
                    params: {prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    $ionicLoading.hide();
                    if (response.data.httpcode == 'success')
                    {
                        $state.go('app.success', {'id': response.data.orderId, 'serviceId': response.data.scheduleId});
                    } else {
                        $state.go('app.failure', {'id': response.data.orderId, 'serviceId': response.data.scheduleId});
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.payNow = function () {
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.discount = window.localStorage.getItem('coupondiscount');
                //console.log($scope.discount + '--' + $scope.userId);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {discount: $scope.discount, disapply: $scope.discountApplied, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    console.log(response);
                    //$ionicLoading.hide();
                    $state.go('app.Gopay', {'link': response.data});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.applyCouponCode = function (ccode) {
                // console.log(ccode);

                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.prodid = window.localStorage.getItem('prodid');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                // console.log($scope.prodid + '--' + $scope.userId);
                $http({
                    method: 'GET',
                    url: domain + 'buy/apply-coupon-code',
                    params: {couponCode: ccode, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data == '0') {
                        alert('Please provide a valid coupon code');
                        $('#coupon').val("");
                        $('#coupon_error').html('Please provide a valid coupon code');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '2') {
                        alert('Sorry, this coupon code has been expired');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon code has been expired');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '3' || response.data == '5') {
                        alert('Sorry, this coupon is not valid for this doctor');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry,  this coupon is not valid for this doctor');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    if (response.data == '4') {
                        alert('Sorry, this coupon is not valid for this user');
                        $('#coupon').val("");
                        $('#coupon_error').html('Sorry, this coupon is not valid for this user');
                        window.localStorage.setItem('coupondiscount', '0');
                    } else
                    {
                        $('#coupon').val("");
                        $scope.apply = 1;
                        $scope.discountApplied = response.data;
                        $('#coupon_error').html('Coupon Applied.');
                        window.localStorage.setItem('coupondiscount', response.data);
                    }


                });
            };
        })

        .controller('GoPaymentCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.link);
            $scope.link = $stateParams.link;
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $timeout(function () {
                jQuery("iframe").css("height", jQuery(window).height());
                //console.log('huu' + jQuery(window).height());
            }, 100);
        })

        .controller('SuccessCtrl', function ($scope, $http, $stateParams, $state) {
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
                $scope.appointment = responseData.data.app;
            }, function errorCallback(response) {
                console.log(response);
            });
            window.localStorage.removeItem('supid');
            window.localStorage.removeItem('startslot');
            window.localStorage.removeItem('endslot');
            window.localStorage.removeItem('prodid');
            $scope.shareRecords = function (drId) {
                window.localStorage.setItem('shareDrId', drId);
                $state.go('app.category-detail', {}, {reload: true});
            };
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

        .controller('CurrentTabCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'appointment/get-app-details',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function successCallback(response) {
                //console.log(response.data);
                $scope.time = response.data.time;
                $scope.endTime = response.data.end_time;
                $scope.app = response.data.app;
                $scope.doctor = response.data.doctorsData;
                $scope.products = response.data.products;
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.cancelApp = function (appId, drId, mode, startTime) {
                $scope.appId = appId;
                $scope.userId = get('id');
                console.log(startTime);
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                console.log(curtime);
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                            $state.go('app.consultations-list');
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                } else {
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/cancel-app',
                        params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                        $state.go('app.consultations-list');
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            };
            $scope.rescheduleApp = function (appId, drId, mode, startTime) {
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(timeDiff);
                if (timeDiff < 15) {
                    alert("Appointment can not be reschedule now!");
                } else if (timeDiff > 15) {
                    if (mode == 1) {
                        if (timeDiff < 60) {
                            alert("Appointment can not be reschedule now!");
                        } else {
                            window.localStorage.setItem('appId', appId);
                            //window.location.href = '#/app/reschedule-appointment/'+drId;
                            $state.go('app.reschedule-appointment', {'id': drId}, {reload: true});
                        }
                    } else {
                        window.localStorage.setItem('appId', appId);
                        $state.go('app.reschedule-appointment', {'id': drId}, {reload: true});
                    }
                }
            };

            $scope.joinDoctor = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
        })

        .controller('PatientJoinCtrl', function ($scope, $http, $stateParams, $sce, $filter, $timeout, $state, $ionicHistory) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $http({
                method: 'GET',
                url: domain + 'appointment/join-doctor',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45463682';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                var token = response.data.oToken;
                if (OT.checkSystemRequirements() == 1) {
                    var session = OT.initSession(apiKey, sessionId);
                } else {
                    alert("Your device is not compatible");
                }
                session.on({
                    streamCreated: function (event) {

                        subscriber = OT.initSubscriber('subscribersDiv', {width: "100%", height: "100%"});
                        session.publish(subscriber);
                    },
                    sessionDisconnected: function (event) {
                        if (event.reason === 'networkDisconnected') {
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                        }
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        alert("Error connecting: ", error.code, error.message);
                    } else {
                        jQuery('#myPublisherDiv').html('Waiting for doctor to join!');
                        publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                        session.publish(publisher);
                        var mic = 1;
                        var mute = 1;
                        jQuery(".muteMic").click(function () {
                            if (mic == 1) {
                                publisher.publishAudio(false);
                                mic = 0;
                            } else {
                                publisher.publishAudio(true);
                                mic = 1;
                            }
                        });
                        jQuery(".muteSub").click(function () {
                            if (mute == 1) {
                                subscriber.subscribeToAudio(false);
                                mute = 0;
                            } else {
                                subscriber.subscribeToAudio(true);
                                mute = 1;
                            }
                        });
                    }
                });
            }, function errorCallback(e) {
                console.log(e);
            });
            $scope.exitVideo = function () {
                try {
                    publisher.destroy();
                    subscriber.destroy();
                    $state.go('app.category-list', {}, {reload: true});
                    window.location.href = "#/app/category-listing";
                } catch (err) {

                }


            };
        })

        .controller('JoinChatCtrl', function ($scope, $http, $stateParams, $sce) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.msgs = {};
            $http({
                method: 'GET',
                url: domain + 'chat/patient-join-chat',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                $scope.msgs = response.data.chat;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45463682';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                var token = response.data.oToken;
                var session = OT.initSession(apiKey, sessionId);
                session.connect(token, function (error) {
                    if (error) {
                        console.log("Error connecting: ", error.code, error.message);
                    } else {
                        console.log("Connected to the session.");
                    }
                });
                session.on("signal", function (event) {
                    console.log("Signal sent from connection " + event.from.id);
                    $('#subscribersDiv').append(event.data);
                });
                $scope.send = function () {
                    session.signal({data: jQuery("[name='msg']").val()},
                            function (error) {
                                if (error) {
                                    console.log("signal error ("
                                            + error.code
                                            + "): " + error.message);
                                } else {
                                    var msg = jQuery("[name='msg']").val();
                                    $http({
                                        method: 'GET',
                                        url: domain + 'chat/add-patient-chat',
                                        params: {from: $scope.userId, to: $scope.user[0].id, msg: msg}
                                    }).then(function sucessCallback(response) {
                                        console.log(response);
                                        jQuery("[name='msg']").val('');
                                    }, function errorCallback(e) {
                                        console.log(e.responseText);
                                    });
                                    console.log("signal sent.");
                                }
                            }
                    );
                };
            }, function errorCallback(e) {
                console.log(e.responseText);
            });
        })

        .controller('RescheduleAppointmentCtrl', function ($scope, $http, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.pSch = [];
            $scope.schP = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.appId = window.localStorage.getItem('appId');
            $http({
                method: 'GET',
                url: domain + 'doctors/get-service-details',
                params: {id: $stateParams.id, appId: $scope.appId}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.appointment = response.data.app;
                $scope.doctor = response.data.user;
                $scope.Prod = response.data.product;
                $scope.Inc = response.data.inclusions;
                $scope.prSch = response.data.pSch;
                angular.forEach($scope.prSch, function (value, key) {
                    var supsassId = value.supersaas_id;
                    //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                    //console.log(supsassId);
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctors-availability',
                        params: {id: supsassId, from: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    }).then(function successCallback(responseData) {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schP[key] = supsassId;
                        if (responseData.data.lastdate == '')
                        {
                            $scope.schdate[key] = new Date();
                            var tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = tomorrow;
                        } else {
                            $scope.schdate[key] = new Date(responseData.data.lastdate);
                            var tomorrow = new Date(responseData.data.lastdate);
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        }
                        $rootScope.$digest;
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    console.log(responseData.data);
                    $ionicLoading.hide();
                    if (responseData.data.lastdate == '')
                    {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date();
                        $scope.nextdate[key] = new Date();
                        $rootScope.$digest;
                    } else {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date(responseData.data.lastdate);
                        var tomorrow = new Date(responseData.data.lastdate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                        $rootScope.$digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.getFirstSlots = function (supsassId, key, serv) {
                console.log(supsassId + ' - ' + key + ' - ' + serv);
                //var from = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    params: {id: supsassId, from: new Date()}
                }).then(function successCallback(responseData) {
                    console.log(responseData);
                    $ionicLoading.hide();
                    if (responseData.data.slots == '') {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date();
                        var tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                    } else {
                        $scope.pSch[key] = responseData.data.slots;
                        $scope.schdate[key] = new Date(responseData.data.lastdate);
                        var tomorrow = new Date(responseData.data.lastdate);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        $scope.nextdate[key] = $filter('date')(new Date(tomorrow), 'yyyy-MM-dd');
                    }

                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.bookSlot = function (starttime, endtime, supid) {
                console.log(starttime + '===' + endtime + '=========' + supid);
                $scope.bookingStart = starttime;
                $scope.bookingEnd = endtime;
                $scope.supId = supid;
            };
            $scope.bookNewAppointment = function (prodId) {
                $scope.prodid = prodId;
                $scope.userId = get('id');
                if ($scope.bookingStart) {
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/schedule-new-app',
                        params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.bookingStart, endSlot: $scope.bookingEnd}
                    }).then(function successCallback(response) {
                        console.log(response);
                        if (response.data == 'error') {
                            alert("Appointment can not be reschedule now!");
                        } else {
                            if (response.data.httpcode == 'error') {
                                alert("Sorry, new appointment is not booked!");
                            } else {
                                alert('Your appointment is rescheduled successfully.');
                                $ionicHistory.clearHistory();
                                $ionicHistory.clearCache();
                                $state.go('app.consultations-list', {}, {reload: true});

                            }
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                } else {
                    alert('Please select slot');
                }
            };
            $scope.cancelReschedule = function () {
                window.localStorage.removeItem('appId');
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $state.go('app.consultations-list', {}, {reload: true});
            };
        })
        ;
