var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', [])

        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');

            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.walkthrough');
            }
        })

// APP
        .controller('AppCtrl', function ($scope, $state, $ionicConfig, $rootScope, $ionicLoading, $ionicHistory, $timeout) {

            $rootScope.imgpath = domain + "/public/frontend/user/";

            if (window.localStorage.getItem('id') != null) {
                $rootScope.userLogged = 1;
                $rootScope.username = window.localStorage.getItem('fname');

            } else {
                if ($rootScope.userLogged == 0)
                    $state.go('auth.walkthrough');
            }
            $scope.logout = function () {
                $ionicLoading.show({template: 'Logging out....'});
                window.localStorage.clear();
                $rootScope.userLogged = 0;
                $rootScope.$digest;
                $timeout(function () {
                    $ionicLoading.hide();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                    $state.go('auth.walkthrough', {}, {reload: true});
                }, 30);
            };
        })

        .controller('SearchBarCtrl', function ($scope, $state, $ionicConfig, $rootScope) {

        })




//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
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
                        //console.log(response);
                        if (angular.isObject(response)) {
                            $scope.loginError = '';
                            $scope.loginError.digest;
                            store(response);
                            $rootScope.userLogged = 1;
                            $rootScope.username = response.fname;

                            $ionicLoading.hide();
                            $state.go('app.category-list');
                            //}
                        } else {

                            $rootScope.userLogged = 0;
                            $scope.loginError = response;
                            $scope.loginError.digest;
                            $ionicLoading.hide();
                            $timeout(function () {
                                $scope.loginError = response;
                                $scope.loginError.digest;
                            })

                            //console.log('else part login');
                        }
                        $rootScope.$digest;
                        $rootScope.$response;
                    },
                    error: function (e) {
                        //  console.log(e.responseText);
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
        .controller('LogoutCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, $timeout, $q, $rootScope) {
//            window.localStorage.clear();
//            $rootScope.userLogged = 0;
//            $rootScope.$digest;
//            $state.go('auth.login', {}, {reload: true});
            $ionicLoading.show({template: 'Logging out....'});
            window.localStorage.clear();
            $rootScope.userLogged = 0;
            $rootScope.$digest;
            $timeout(function () {
                $ionicLoading.hide();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                $state.go('auth.walkthrough', {}, {reload: true});
            }, 30);
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
                    }
                });
            };
            //check OTP
            $scope.checkOTP = function (otp) {
                $scope.user = {};
                $scope.user.name = window.localStorage.getItem('name');
                $scope.user.email = window.localStorage.getItem('email');
                $scope.user.phone = window.localStorage.getItem('phone');
                $scope.user.password = window.localStorage.getItem('password');
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password;
                var code = window.localStorage.getItem('code');
                if (parseInt(code) === parseInt(otp)) {
                    $.ajax({
                        type: 'GET',
                        url: domain + "register",
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function (response) {
                            if (angular.isObject(response)) {
                                store(response);
                                $rootScope.userLogged = 1;
                                alert('Your sucessfully registered');
                                $state.go('app.category-list', {}, {reload: true});
                            } else {
                                alert('Please fill all the details for signup');
                            }
                            $rootScope.$digest;
                        },
                        error: function (e) {
                            console.log(e.responseText);
                        }
                    });
                }
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
                    } else {
                        $scope.emailError = "";
                        $scope.emailError.digest;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
        })

        .controller('ForgotPasswordCtrl', function ($scope, $state, $ionicLoading) {
            $scope.recoverPassword = function (email, phone) {
                window.localStorage.setItem('email', email);
                console.log("email:  " + email);
                $.ajax({
                    type: 'GET',
                    url: domain + "recovery-password",
                    data: {email: email, phone: phone},
                    cache: false,
                    success: function (response) {
                        console.log("respone passcode" + response.passcode);
                        window.localStorage.setItem('passcode', response.passcode);
                        $state.go('auth.update-password', {}, {reload: true});
                    }
                });
            };
            $scope.updatePassword = function (passcode, password, cpassword) {
                var email = window.localStorage.getItem('email');
                $.ajax({
                    type: 'GET',
                    url: domain + "update-password",
                    data: {passcode: passcode, password: password, cpassword: cpassword, email: email},
                    cache: false,
                    success: function (response) {
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
            $http({
                method: 'GET',
                url: domain + 'records/get-record-categories',
                params: {userId: $scope.userid}
            }).then(function successCallback(response) {
                $scope.cats = [];
                angular.forEach(response.data, function (value, key) {
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

            $scope.selectMe = function (event) {
                $(event.target).toggleClass('active');
            }


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
                $scope.category = $stateParams.id;
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.addOther = function (name, field, val) {
                addOther(name, field, val);
            };
            $scope.addNewElement = function (ele) {
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
                $http({
                    method: "GET",
                    url: domain + "records/get-record-value",
                    params: {id: $stateParams.id}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    angular.forEach(response.data, function (value, key) {
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
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                $http({
                    method: 'POST',
                    url: domain + 'records/delete',
                    params: {id: id}
                }).then(function successCallback(response) {
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

            $scope.dnlink = function ($nurl) {
                $state.go($nurl);
            }
            $scope.imgpath = domain;

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
                $scope.specializations = response.data.spec;
                //Video
                $scope.video_time = response.data.video_time;
                $scope.video_app = response.data.video_app;
                $scope.video_doctorsData = response.data.video_doctorsData;
                $scope.video_products = response.data.video_products;
                $scope.video_end_time = response.data.video_end_time;
                // Video past
                $scope.video_time_past = response.data.video_time_past;
                $scope.video_app_past = response.data.video_app_past;
                $scope.video_doctorsData_past = response.data.video_doctorsData_past;
                $scope.video_products_past = response.data.video_products_past;
                $scope.video_end_time_past = response.data.video_end_time_past;
                //console.log('##########'+ $scope.video_app_past);
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

            $scope.joinVideo = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    //$state.go('app.patient-join', {}, {reload: true});
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {cache: false}, {reload: true});
                } else {
                    alert("You can join video 15 minutes before the appointment");
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
                        $ionicLoading.hide();
                        $scope.getDprice = responseData.price;
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


        .controller('ConsultationProfileCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $filter, $ionicLoading, $ionicModal, $timeout, $ionicTabsDelegate) {
            $scope.apply = '0';
            $scope.discountApplied = '0';
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
                //console.log("prodId " + $scope.instVideo + "popopo");
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
            
            $scope.doit = function(){
               console.log("removeitem");
                    window.localStorage.removeItem('startSlot');
                    window.localStorage.removeItem('endSlot');
            }

            $scope.checkAvailability = function (uid, prodId) {
                console.log("prodId " + prodId);
                console.log("uid " + uid);
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-doctor-availability',
                    params: {id: uid}
                }).then(function successCallback(responseData) {
                    var dataInfo = responseData.data.split('-');
                    console.log(dataInfo);
                    if (responseData.data == 1) {
                      
                        $state.go('app.checkavailable', {'data': prodId, 'uid': uid});
                    } else {
                        alert('Sorry, Doctor not available for this time!');
                    }
                });

            };
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
                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                console.log($scope.bookingStart);
                if ($scope.bookingStart) {
                    window.localStorage.setItem('supid', $scope.supId);
                    // added code//
                    window.localStorage.removeItem('IVendSlot');
                    window.localStorage.removeItem('IVstartSlot');
                    window.localStorage.removeItem('instantV');
                    //end code
                    
                    window.localStorage.setItem('startSlot', $scope.bookingStart);
                    window.localStorage.setItem('endSlot', $scope.bookingEnd);
                    window.localStorage.setItem('prodId', prodId);
                    window.localStorage.setItem('mode', serv);
                    $rootScope.supid = $scope.supId;
                    $rootScope.startSlot = $scope.bookingStart;
                    $rootScope.endSlot = $scope.bookingEnd;
                    $rootScope.prodid = prodId;
                    $rootScope.url = 'app.payment';
                    $rootScope.$digest;

                    if (serv == 1) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            console.log('1')
                            $state.go('app.payment');
                        }
                        else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
                    } else if (serv == 3 || serv == 4) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            console.log('2')
                            $state.go('app.payment');
                        }
                        else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
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

            /* view more doctor profile modalbox*/
            $ionicModal.fromTemplateUrl('viewmoreprofile.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
            /* end profile */
            $ionicLoading.show({template: 'Loading...'});
            $timeout(function () {
                $ionicLoading.hide();
                $ionicTabsDelegate.select(0);
            }, 10);

        })

        .controller('PaymentCtrl', function ($scope, $http, $state, $filter, $location, $stateParams, $rootScope, $ionicLoading, $ionicGesture, $timeout, $ionicHistory) {
            $scope.mode = window.localStorage.getItem('mode');
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodId');
            $scope.apply = '0';
            $scope.ccode = '';
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.discountApplied = '0';
            $http({
                method: 'GET',
                url: domain + 'doctors/get-order-review',
                params: {id: $scope.supid, prodId: $scope.prodid}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
                $ionicLoading.show({template: 'Loading...'});
                //$ionicLoading.hide();
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $scope.IVstartSlot = responseData.data.IVstart;
                $scope.IVendSlot = responseData.data.IVend;
                window.localStorage.setItem('IVstartSlot', $scope.IVstartSlot);
                window.localStorage.setItem('IVendSlot', $scope.IVendSlot);
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.bookNow = function () {
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
            $scope.payNow = function (finalamount) {
                //alert(finalamount);
                if (window.localStorage.getItem('instantV') == 'instantV') {
                    $scope.startSlot = window.localStorage.getItem('IVstartSlot');
                    $scope.endSlot = window.localStorage.getItem('IVendSlot');
                } else {
                    $scope.startSlot = window.localStorage.getItem('startSlot');
                    $scope.endSlot = window.localStorage.getItem('endSlot');
                }
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.discount = window.localStorage.getItem('coupondiscount');
                $scope.kookooID = window.localStorage.getItem('kookooid');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {kookooID: $scope.kookooID, ccode: $scope.ccode, discount: $scope.discount, disapply: $scope.discountApplied, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    window.localStorage.removeItem('coupondiscount');
                    window.localStorage.setItem('coupondiscount', '')
                    console.log(response.data);
                    if (finalamount > 0) {
                        $state.go('app.Gopay', {'link': response.data});
                        console.log(response.data);
                    } else {
                        $scope.discountval = response.data.discount;
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('app.thankyou', {'data': response.data}, {reload: true});

                    }
//                    if ((parseInt($scope.discount) == parseInt($scope.discountApplied)) && (parseInt($scope.discount) > 0)) {
//                     
//                        $scope.discountval = response.data.discount;
//                        $ionicHistory.nextViewOptions({
//                            disableBack: true
//                        });
//						
//			 $state.go('app.thankyou', {'data': response.data}, {reload: true});
//				 
//                    } else {
//				
//                      $state.go('app.Gopay', {'link': response.data});
//						console.log(response.data)
//                      //window.location.href=response.data
//                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.applyCouponCode = function (ccode) {
                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.prodid = window.localStorage.getItem('prodId');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.ccode = ccode;
                console.log($scope.discount + '--' + $scope.discountApplied + '++++ ' + $scope.userId);
                $http({
                    method: 'GET',
                    url: domain + 'buy/apply-coupon-code',
                    params: {couponCode: ccode, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    // console.log(response);
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












        .controller('ThankyouCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
            $scope.data = $stateParams.data;
            $scope.gotohome = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                window.localStorage.removeItem('kookooid');
                    window.localStorage.removeItem('coupondiscount');
                    window.localStorage.removeItem('IVendSlot');
                    window.localStorage.removeItem('IVstartSlot');
                    window.localStorage.removeItem('instantV');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
//                $scope.$on("$destroy", function () {
//                    
//                    console.log('cleared');
 // });

                //$state.go('app.category-list', {}, {reload: true});
                $state.go('app.consultations-current', {}, {reload: true});
            }



        })

        .controller('GoPaymentCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.link);
            $scope.link = $stateParams.link;
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };
            $timeout(function () {
                jQuery("iframe").css("height", jQuery(window).height());
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
            $http({
                method: 'GET',
                url: domain + 'orders/get-failure-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId}
            }).then(function successCallback(responseData) {
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
                $scope.time = response.data.time;
                $scope.endTime = response.data.end_time;
                $scope.app = response.data.app;
                $scope.doctor = response.data.doctorsData;
                $scope.products = response.data.products;
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.joinDoctor = function (mode, start, end, appId) {
                console.log(mode + "===" + start + '===' + end + "===" + $scope.curTime + "==" + appId);
                if ($scope.curTime >= start || $scope.curTime <= end) {
                    console.log('redirect');
                    $state.go('app.patient-join', {'id': appId, 'mode': mode}, {reload: true});
                } else {
                    alert("You can join video before 15 minutes.");
                }
            };
        })



        // $ionicHistory.clearCache();

        .controller('PatientJoinCtrl', function ($window, $scope, $http, $stateParams, $sce, $filter, $timeout, $state, $ionicHistory, $ionicLoading) {
            if (!get('loadedOnce')) {
                store({'loadedOnce': 'true'});
                $window.location.reload(true);
                // don't reload page, but clear localStorage value so it'll get reloaded next time
                $ionicLoading.hide();
            } else {
                // set the flag and reload the page
                window.localStorage.removeItem('loadedOnce');
                $ionicLoading.hide();

            }
            // $ionicHistory.clearCache();
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
                $ionicLoading.hide();
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45121182';
                var sessionId = response.data.app[0].appointments.opentok_session_id;
                var token = response.data.oToken;

                if (OT.checkSystemRequirements() == 1) {
                    session = OT.initSession(apiKey, sessionId);
                    $ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                    alert("Your device is not compatible");
                }

                session.on({
                    streamDestroyed: function (event) {
                        event.preventDefault();
                        jQuery("#subscribersDiv").html("Doctor Left the Consultation");
                    },
                    streamCreated: function (event) {
                        subscriber = session.subscribe(event.stream, 'subscribersDiv', {width: "100%", height: "100%", subscribeToAudio: true});
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/update-join',
                            params: {id: $scope.appId, userId: $scope.userId}
                        }).then(function sucessCallback(response) {
                            console.log(response);
                            $ionicLoading.hide();
                        }, function errorCallback(e) {
                            $ionicLoading.hide();
                            console.log(e);
                        });

                    },
                    sessionDisconnected: function (event) {
                        if (event.reason === 'networkDisconnected') {
                            $ionicLoading.hide();
                            alert('You lost your internet connection.'
                                    + 'Please check your connection and try connecting again.');
                        }
                    }
                });
                session.connect(token, function (error) {
                    if (error) {
                        $ionicLoading.hide();
                        alert("Error connecting: ", error.code, error.message);

                    } else {
                        publisher = OT.initPublisher('myPublisherDiv', {width: "30%", height: "30%"});
                        session.publish(publisher);


                        var mic = 1;
                        var mute = 1;
                        jQuery(".muteMic").click(function () {
                            if (mic == 1) {
                                publisher.publishAudio(false);
                                mic = 0;
                                $ionicLoading.hide();
                            } else {
                                publisher.publishAudio(true);
                                mic = 1;
                                $ionicLoading.hide();
                            }
                        });
                        jQuery(".muteSub").click(function () {
                            if (mute == 1) {
                                subscriber.subscribeToAudio(false);
                                mute = 0;
                                $ionicLoading.hide();
                            } else {
                                subscriber.subscribeToAudio(true);
                                mute = 1;
                                $ionicLoading.hide();
                            }
                        });
                    }
                });

            }, function errorCallback(e) {
                console.log(e);
                $ionicLoading.hide();
            });
            $scope.exitVideo = function () {
                try {
                    publisher.destroy();
                    subscriber.destroy();
                    session.unsubscribe();
                    session.disconnect();


                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.consultations-current', {}, {reload: true});
                    //window.location.href = "#/app/category-listing";
                } catch (err) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    })
                    $state.go('app.consultations-current', {}, {reload: true});

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
                //console.log(response.data);
                $scope.user = response.data.user;
                $scope.app = response.data.app;
                $scope.msgs = response.data.chat;
                //$scope.oToken = "https://test.doctrs.in/opentok/opentok?session=" + response.data.app[0].appointments.opentok_session_id;
                var apiKey = '45121182';
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



        .controller('CheckavailableCtrl', function ($scope, $state, $http, $stateParams, $timeout, $ionicModal, $ionicPopup) {
            $scope.data = $stateParams.data;
            $scope.uid = $stateParams.uid;

            /* patient confirm */
            $scope.showConfirm = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Confirmation',
                    template: '<p align="center"><strong>Doctor is Available</strong></p><div>The specialist has accepted your request for an instant video call. Do you want to continue?</div>'
                });

                confirmPopup.then(function (res) {
                   
                    if (res != true) {
                       
                          $scope.kookooID = window.localStorage.getItem('kookooid');
                           $scope.prodid = window.localStorage.getItem('prodId');
                      $http({
                        method: 'GET',
                        url: domain + 'kookoo/reject-by-patient',
                        params: {kookooid: $scope.kookooID }
                    }).then(function successCallback(patientresponse) {
                        console.log(patientresponse.data);
                        
                        //$state.go('app.consultations-profile', {'data': $scope.prodid}, {reload: true});
                         $state.go('app.consultations-list', {reload: true});
                    }, function errorCallback(patientresponse) {
                      //  alert('Oops something went wrong!');
                    });
                    } else {
                        $http({
                        method: 'GET',
                        url: domain + 'kookoo/accept-by-patient',
                        params: {kookooid: $scope.kookooID }
                    }).then(function successCallback(patientresponse) {
                        console.log(patientresponse.data);
                        // window.localStorage.setItem('kookooid', response.data);
                         $state.go('app.payment');

                    }, function errorCallback(patientresponse) {
                      //  alert('Oops something went wrong!');
                    });
                        
                    
                    }
                });
            };






            /*timer */
            $scope.IsVisible = false;
            $scope.counter = 30;
            var stopped;



            $scope.countdown = function (dataId, uid) {
                // dataId product id , uid =>user id
                // console.log("dataId"+dataId);
                // console.log("uid"+uid)
                window.localStorage.setItem('prodId', $scope.data);
                window.localStorage.setItem('instantV', 'instantV');
                window.localStorage.setItem('mode', 1);
                //alert(dataId);
                $scope.kookooID = window.localStorage.getItem('kookooid');

                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-kookoo-value',
                    params: {kookooId: $scope.kookooID}
                }).then(function successCallback(responsekookoo) {
                    console.log(responsekookoo.data);
                    if (responsekookoo.data == 1)
                    {
                        $timeout.cancel(stopped);
                        $scope.showConfirm();
                       // $state.go('app.payment');


                    }
                    else if (responsekookoo.data == 2)
                    {
                        $timeout.cancel(stopped);
                         window.localStorage.removeItem('kookooid');
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        $state.go('app.consultations-list', {}, {reload: true});
                    }
                    if ($scope.counter == 1) {
                        if (responsekookoo.data == 0)
                    {
                        $timeout.cancel(stopped);
                       // $scope.showConfirm();
                       // $state.go('app.payment');
                       
                    $http({
                    method: 'GET',
                    url: domain + 'kookoo/update-timer-expired',
                    params: {kookooId: $scope.kookooID}
                        }).then(function successCallback(responseexpired) {
                            alert("Sorry. Your transaction's time limit has expired. Please try booking again");
                            $state.go('app.consultations-list', {}, {reload: true});
                    }, function errorCallback(responseexpired) {
                        
                    });
                    }
                    }
                }, function errorCallback(responsekookoo) {
                    if (responsekookoo.data == 0)
                    {
                        alert('No doctrs available');
                        $state.go('app.consultations-list', {}, {reload: true});
                    }
                });

                $scope.IsVisible = true;

                stopped = $timeout(function () {
                    // console.log($scope.counter);
                    $scope.counter--;
                    $scope.countdown();
                }, 1000);


                if ($scope.counter == 29) {
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/check-doctrs-response',
                        params: {uid: $scope.uid}
                    }).then(function successCallback(response) {
                        //console.log($scope.counter);
                        window.localStorage.setItem('kookooid', response.data);

                    }, function errorCallback(response) {
                        alert('Oops something went wrong!');
                    });
                }

                if ($scope.counter == 0) {
                    $scope.IsVisible = false;
                    // $scope.showConfirm();
                    $timeout.cancel(stopped);
                }
            };








            $scope.hidediv = function () {
                $scope.IsVisible = false;
                $timeout.cancel(stopped);
                 $scope.prodid = window.localStorage.getItem('prodId');
                 $scope.kookooID = window.localStorage.getItem('kookooid');
                 $http({
                        method: 'GET',
                        url: domain + 'kookoo/cancel-by-patient',
                        params: {kookooid: $scope.kookooID }
                    }).then(function successCallback(patientresponse) {
                        console.log(patientresponse.data);
                       
                        $state.go('app.consultations-list', {reload: true});

                    }, function errorCallback(patientresponse) {
                      
                    });
                 
                  
                
               // $scope.counter = 20;
            };


        })






        .controller('RescheduleCtrl', function ($scope, $http, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.cancelApp = function (appId, drId, mode, startTime) {
                $scope.appId = appId;
                $scope.userId = get('id');
                var curtime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                var timeDiff = getTimeDiff(startTime, curtime);
                console.log(curtime + "===" + startTime + "===" + timeDiff);
                if (timeDiff < 15) {
                    if (mode == 1) {
                        alert("Appointment can not be cancelled now!");
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, userId: $scope.userId}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            if (response.data == 'success') {
                                alert('Your appointment is cancelled successfully.');
                                $state.go('app.consultations-current', {}, {reload: true});

                            } else {
                                alert('Sorry your appointment is not cancelled.');
                            }
                        }, function errorCallback(response) {
                            console.log(response);
                        });
                    }
                } else {
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/cancel-app',
                        params: {appId: $scope.appId, userId: $scope.userId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == 'success') {
                            alert('Your appointment is cancelled successfully.');
                            $state.go('app.consultations-current', {}, {reload: true});
                        } else {
                            alert('Sorry your appointment is not cancelled.');
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            };
            $scope.rescheduleApp = function (appId, drId, mode, startTime) {
                console.log(appId + "===" + drId + "===" + mode + "===" + startTime);
                $scope.appId = appId;
                $scope.userId = get('id');
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
                            console.log('redirect');
                            window.localStorage.setItem('appId', appId);
                            $state.go('app.reschedule-appointment', {'id': drId}, {reload: true});
                        }
                    } else {
                        window.localStorage.setItem('appId', appId);
                        $state.go('app.reschedule-appointment', {'id': drId}, {reload: true});
                    }
                }
            };
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
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.consultations-list', {}, {reload: true});
            };
			
        });
