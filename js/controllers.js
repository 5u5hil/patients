var publisher;
var session;
var subscriber;
angular.module('your_app_name.controllers', ['ionic', 'ngCordova'])
        .controller('AuthCtrl', function ($scope, $state, $ionicConfig, $rootScope) {
            $scope.interface = window.localStorage.setItem('interface_id', '3');
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
            $rootScope.attachpath = domain + "/public";

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
.controller('DoctorRecordJoinCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.startRecording = function () {
                $http({
                    method: 'GET',
                    url: domain + 'doctors/start-recording',
                    params: {interface: $scope.interface}
                }).then(function successCallback(response) {

                    //$state.go('app.category-detail');
                }, function errorCallback(e) {
                    console.log(e);
                });
            }

        })
//LOGIN
        .controller('LoginCtrl', function ($scope, $state, $templateCache, $q, $rootScope, $ionicLoading, $timeout) {
            window.localStorage.setItem('interface_id', '3');
            $scope.interface = window.localStorage.getItem('interface_id');
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
            $scope.interface = window.localStorage.setItem('interface_id', '3');
            $scope.user = {};
            $scope.user.name = '';
            $scope.user.email = '';
            $scope.user.phone = '';
            $scope.user.password = '';
            $scope.doSignUp = function () {
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface;
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
            //check OTP bhavana
            $scope.checkOTP = function (otp) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.user = {};
                $scope.user.name = window.localStorage.getItem('name');
                $scope.user.email = window.localStorage.getItem('email');
                $scope.user.phone = window.localStorage.getItem('phone');
                $scope.user.password = window.localStorage.getItem('password');
                var data = "name=" + $scope.user.name + "&email=" + $scope.user.email + "&phone=" + $scope.user.phone + "&password=" + $scope.user.password + "&interface=" + $scope.interface;
                console.log("data " + data);
                var code = window.localStorage.getItem('code');
                if (parseInt(code) === parseInt(otp)) {
                    console.log('code' + code + '--otp--' + otp)
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
                } else {
                    alert('Enterd OTP code is incorrect.Kindly ckeck');
                }
            };
            //Check if email is already registered
            $scope.checkEmail = function (email) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $http({
                    method: 'GET',
                    url: domain + 'check-user-email',
                    params: {userEmail: email, interface: $scope.interface}
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
            //Check if phone is already registered - bhavana
            $scope.checkPhone = function (phone) {
                $scope.interface = window.localStorage.getItem('interface_id');
                $http({
                    method: 'GET',
                    url: domain + 'check-user-phone',
                    params: {userPhone: phone, interface: $scope.interface}
                }).then(function successCallback(response) {
                    if (response.data > 0) {
                        $scope.user.phone = '';
                        $scope.phoneError = "This phone number is already registered!";
                        $scope.phoneError.digest;
                    } else {
                        $scope.phoneError = "";
                        $scope.phoneError.digest;
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

        .controller('AdsCtrl', function ($scope, $http, $state, $ionicActionSheet, AdMob, iAd, $ionicModal) {
            $scope.interface = window.localStorage.getItem('interface_id');
            // Load the modal from the given template URL
            $ionicModal.fromTemplateUrl('addrecord.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.getCategory = function () {
                    $http({
                        method: 'GET',
                        url: domain + 'records/get-record-categories',
                        params: {userId: $scope.userid, interface: $scope.interface}
                    }).then(function successCallback(response) {
                        $scope.cats = response.data;
                        $scope.modal.show();
                        // angular.forEach(response.data, function (value, key) {
                        // $scope.cats.push({text: value.category, id: value.id});
                        // });
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                $scope.addRecord = function ($ab) {
                    $state.go('app.add-category', {'id': $ab}, {reload: true});
                    $scope.modal.hide();
                };
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
        })

//bring specific category providers
        .controller('CategoryListCtrl', function ($scope, $http, $stateParams, $rootScope) {
            if (get('id') != null) {
                $rootScope.userLogged = 1;
            }
        })

        .controller('CategoryDetailCtrl', function ($scope, $http, $stateParams, $ionicFilterBar, $ionicModal, $timeout, $ionicLoading) {

            $scope.catIds = [];
            $scope.catId = [];
            $scope.docId = '';
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.categoryId = $stateParams.categoryId;
            //console.log(get('id'));
            $scope.userid = get('id');
            $scope.patientId = get('id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/view-patient-record-category',
                params: {userId: $scope.userid, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.categories = response.data.categories;
                $scope.doctrs = response.data.doctrs;
                $scope.userRecords = response.data.recordCount;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });

            $scope.getIds = function (id) {
                console.log(id);
                if ($scope.catId[id]) {
                    $scope.catIds.push(id);
                } else {
                    var index = $scope.catIds.indexOf(id);
                    $scope.catIds.splice(index, 1);
                }
                console.log($scope.catIds);
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.catIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.catIds);
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'POST',
                            url: domain + 'records/delete-all',
                            params: {ids: JSON.stringify($scope.catIds), userId: $scope.userid}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            $ionicLoading.hide();
                            $timeout(function () {
                                window.location.reload();
                                //$state.go('app.category-detail');
                            }, 1000);
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.catIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.catIds);
                            $ionicLoading.show({template: 'Loading...'});
                            $http({
                                method: 'POST',
                                url: domain + 'records/share-all',
                                params: {ids: JSON.stringify($scope.catIds), userId: $scope.userid, docId: $scope.docId}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    $ionicLoading.hide();
                                    $timeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };

            var filterBarInstance;
            $scope.selectMe = function (event) {
                $(event.target).toggleClass('active');
            };

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
        })

        .controller('MedicineCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;

            $ionicModal.fromTemplateUrl('prescription-type', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddressCtrl', function ($scope, $http, $stateParams, $ionicModal) {
            $scope.category_sources = [];
            $scope.categoryId = $stateParams.categoryId;

            $ionicModal.fromTemplateUrl('addnewaddress', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('CloseModalCtrl', function ($scope, $ionicModal, $state) {
            $scope.modalclose = function (ulink) {
                $state.go(ulink);
                $scope.modal.hide();
            }
        })

        .controller('knowConditionCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('knowcondition', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('mealDetailsCtrl', function ($scope, $ionicModal, $state) {
            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.submitmodal = function () {
                $scope.modal.hide();
            };
        })

        .controller('AddRecordCtrl', function ($scope, $http, $state, $stateParams, $compile, $ionicModal, $ionicHistory, $filter, $timeout, $ionicLoading, $cordovaCamera, $cordovaFile, $rootScope) {

            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.images = [];
            $scope.image = [];
            $scope.tempImgs = [];
            $scope.prescription = 'Yes';
            $scope.coverage = 'Family Floater';
            $scope.probstatus = 'Current';
            $scope.conId = [];
            $scope.conIds = [];
            $scope.selConditions = [];
            $scope.curTime = new Date();
            $scope.curTimeo = $filter('date')(new Date(), 'HH:mm');
            //$scope.curT = new Date()$filter('date')(new Date(), 'H:i');
            $scope.userId = get('id');
            $scope.categoryId = $stateParams.id;
            $scope.fields = [];
            $scope.problems = [];
            $scope.doctrs = [];
            $scope.day = '';
            $scope.meals = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
            $scope.mealDetails = [];
            $scope.dayMeal = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/add',
                params: {id: $stateParams.id, userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.record = response.data.record;
                $scope.fields = response.data.fields;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.doctrs;
                $scope.category = $stateParams.id;
                $scope.conditions = response.data.knownHistory;
                if ($scope.category == '6') {
                    angular.forEach($scope.fields, function (value, key) {
                        if (value.field == 'Coverage') {
                            $scope.coverage = 'Family Floater';
                        }
                    });
                }
                if ($scope.category == '14') {
                    angular.forEach($scope.fields, function (value, key) {
                        if (value.field == 'Status') {
                            console.log(value.field);
                            $scope.probstatus = 'Current';
                        }
                    });
                }
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getCondition = function (id, con) {
                console.log(id + "==" + con);
                var con = con.toString();
                if ($scope.conId[id]) {
                    $scope.conIds.push(id);
                    $scope.selConditions.push({'condition': con});
                } else {
                    var index = $scope.conIds.indexOf(id);
                    $scope.conIds.splice(index, 1);
                    for (var i = $scope.selConditions.length - 1; i >= 0; i--) {
                        if ($scope.selConditions[i].condition == con) {
                            $scope.selConditions.splice(i, 1);
                        }
                    }
                }
                jQuery("#selcon").val($scope.conIds);
                console.log($scope.selConditions);
                console.log($scope.conIds);
            };
            $scope.addOther = function (name, field, val) {
                console.log(name, field, val);
                addOther(name, field, val);
            };
            $scope.addNewElement = function (ele) {
                addNew(ele);
            };
            $scope.submit = function () {
                //console.log(jQuery("#addRecordForm")[0].length);                
                //alert($scope.tempImgs.length);
                if ($scope.tempImgs.length > 0) {
                    angular.forEach($scope.tempImgs, function (value, key) {
                        $scope.picData = getImgUrl(value);
                        var imgName = value.substr(value.lastIndexOf('/') + 1);
                        $scope.ftLoad = true;
                        $scope.uploadPicture();
                        $scope.image.push(imgName);
                        console.log($scope.image);
                    });
                    jQuery('#camfilee').val($scope.image);
                    console.log($scope.images);
                    $ionicLoading.show({template: 'Adding...'});
                    var data = new FormData(jQuery("#addRecordForm")[0]);
                    callAjax("POST", domain + "records/save", data, function (response) {
                        console.log(response);
                        $ionicLoading.hide();
                        if (angular.isObject(response.records)) {
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            //$scope.image = [];
                            alert("Record added successfully!");
                            $timeout(function () {
                                $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
                            }, 1000);
                        } else if (response.err != '') {
                            alert('Please fill mandatory fields');
                        }
                    });
                } else {
                    if (jQuery("#addRecordForm")[0].length > 2) {
                        $ionicLoading.show({template: 'Adding...'});
                        var data = new FormData(jQuery("#addRecordForm")[0]);
                        callAjax("POST", domain + "records/save", data, function (response) {
                            console.log(response);
                            $ionicLoading.hide();
                            if (angular.isObject(response.records)) {
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                alert("Record added successfully!");
                                $timeout(function () {
                                    $state.go('app.records-view', {'id': $scope.categoryId}, {}, {reload: true});
                                }, 1000);
                            } else if (response.err != '') {
                                alert('Please fill mandatory fields');
                            }
                        });
                    }
                }

                function getImgUrl(imageName) {
                    var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                    var trueOrigin = cordova.file.dataDirectory + name;
                    return trueOrigin;
                }
            };

            $scope.getPrescription = function (pre) {
                console.log('pre ' + pre);
                if (pre === ' No') {
                    console.log("no");
                    jQuery('#convalid').addClass('hide');
                } else if (pre === 'Yes') {
                    console.log("yes");
                    jQuery('#convalid').removeClass('hide');
                }
            };
            //Take images with camera
            $scope.takePict = function (name) {
                //console.log(name);
                var camimg_holder = $("#camera-status");
                camimg_holder.empty();
                // 2
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                };
                // 3
                $cordovaCamera.getPicture(options).then(function (imageData) {
                    //alert(imageData);
                    onImageSuccess(imageData);
                    function onImageSuccess(fileURI) {
                        createFileEntry(fileURI);
                    }
                    function createFileEntry(fileURI) {
                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                    }
                    // 5
                    function copyFile(fileEntry) {
                        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                        var newName = makeid() + name;
                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (fileSystem2) {
                            fileEntry.copyTo(
                                    fileSystem2,
                                    newName,
                                    onCopySuccess,
                                    fail
                                    );
                        },
                                fail);
                    }
                    // 6
                    function onCopySuccess(entry) {
                        var imageName = entry.nativeURL;
                        $scope.$apply(function () {
                            $scope.tempImgs.push(imageName);
                        });
                        $scope.picData = getImgUrl(imageName);
                        //alert($scope.picData);
                        $scope.ftLoad = true;
                        camimg_holder.append('<button class="button button-positive remove" onclick="removeCamFile()">Remove Files</button><br/>');
                        $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(camimg_holder);
                    }
                    function fail(error) {
                        console.log("fail: " + error.code);
                    }
                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (var i = 0; i < 5; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    }
                    function getImgUrl(imageName) {
                        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
                        var trueOrigin = cordova.file.dataDirectory + name;
                        return trueOrigin;
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.uploadPicture = function () {
                //$ionicLoading.show({template: 'Uploading..'});
                var fileURL = $scope.picData;
                var name = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                var params = {};
//                params.value1 = "someparams";
//                params.value2 = "otherparams";
//                options.params = params;
                var uploadSuccess = function (response) {
                    alert('Success  ====== ');
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                    //$scope.image.push(name);
                    //$ionicLoading.hide();
                }
                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI(domain + 'records/upload'), uploadSuccess, function (error) {
                    //$ionicLoading.show({template: 'Error in connecting...'});
                    //$ionicLoading.hide();
                }, options);
            };

            $scope.chkDt = function (dt) {
                console.log(dt);
                console.log($scope.curTime);
                console.log($scope.curTime < dt);
                if (!($scope.curTime < dt)) {
                    alert('End date should be greater than start date.');
                    jQuery('#enddt').val('');
                }
            };

            $scope.check = function (val) {
                console.log(val);
                if ($scope.categoryId == 7) {
                    if (val) {
                        jQuery('#billStatus').val('Paid');
                        jQuery('#billmode').removeClass('hide');
                    } else {
                        jQuery('#billStatus').val('Unpaid');
                        jQuery('#billmode').addClass('hide');
                    }
                }
                if ($scope.categoryId == 3) {
                    if (val) {
                        jQuery('#mediStatus').val('Active');
                    } else {
                        jQuery('#mediStatus').val('Inactive');
                    }
                }
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#immrcvdate').val('Received');
                        jQuery('#imdtrcv').removeClass('hide');
                        jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrcvdate').val('To be received');
                        jQuery('#imdtrcv').addClass('hide');
                        jQuery('.imd').addClass('hide');
                    }
                }
                if ($scope.categoryId == 4) {
                    if (val) {
                        jQuery('#proconduct').val('Conducted On');
                        jQuery('#proconon').removeClass('hide');
                        jQuery('.proc').removeClass('hide');
                        jQuery('#proconbef').addClass('hide');
                    } else {
                        jQuery('#proconduct').val('To be conducted');
                        jQuery('#proconon').addClass('hide');
                        jQuery('.proc').addClass('hide');
                        jQuery('#proconbef').removeClass('hide');
                    }
                }
                if ($scope.categoryId == 5) {
                    if (val) {
                        jQuery('#invconduct').val('Conducted');
                        jQuery('#invconon').removeClass('hide');
                        jQuery('.inv').removeClass('hide');
                        jQuery('#invconbef').addClass('hide');
                    } else {
                        jQuery('#invconduct').val('To be conducted');
                        jQuery('#invconon').addClass('hide');
                        jQuery('.inv').addClass('hide');
                        jQuery('#invconbef').removeClass('hide');
                    }
                }
            };

            $scope.rcheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 2) {
                    if (val) {
                        jQuery('#immrepeat').val('Yes');
                        jQuery('#imrpton').removeClass('hide');
                        //jQuery('.imd').removeClass('hide');
                    } else {
                        jQuery('#immrepeat').val('No');
                        jQuery('#imrpton').addClass('hide');
                        //jQuery('.imd').addClass('hide');
                    }
                }
            };

            $scope.shCheck = function (val) {
                console.log(val);
                if ($scope.categoryId == 3) {
                    if (val == '') {
                        jQuery('#prescribeDt').addClass('hide');
                    } else {
                        jQuery('#prescribeDt').removeClass('hide');
                    }
                }
            };

            $scope.radChange = function (prob) {
                console.log(prob);
                if ($scope.categoryId == 14) {
                    if (prob != 'Past') {
                        jQuery('#probend').addClass('hide');
                    } else {
                        jQuery('#probend').removeClass('hide');
                    }
                }
            };

            $scope.setFile = function (element) {
                $scope.currentFile = element.files[0];
                console.log('length = ' + element.files.length);
                var image_holder = $("#image-holder");
                image_holder.empty();
                if (element.files.length > 0) {
                    jQuery('#convalid').removeClass('hide');
                    jQuery('#coninprec').removeClass('hide');
                    //jQuery('#valid-till').attr('required', true);
                    image_holder.append('<button class="button button-small button-assertive remove icon ion-close" onclick="removeFile()"></button>');
                } else {
                    jQuery('#convalid').addClass('hide');
                    jQuery('#coninprec').addClass('hide');
                    //jQuery('#valid-till').attr('required', false);
                }
                if (typeof (FileReader) != "undefined") {
                    //loop for each file selected for uploaded.
                    for (var i = 0; i < element.files.length; i++) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
//                            $("<img />", {
//                                "src": e.target.result,
//                                "class": "thumb-image"
//                            }).appendTo(image_holder);
                            $('<span class="upattach"><i class="ion-paperclip"></i></span>').appendTo(image_holder);
                        }
                        image_holder.show();
                        reader.readAsDataURL(element.files[0]);
                    }
                }
            };

            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodal = function (day) {
                    console.log('Index = ' + day + ' day' + (day - 1));
                    $scope.day = 'day' + (day - 1);
                    $scope.modal.show();
                };

            });
            $scope.dietdetails = function (days) {
                console.log(days);
                $scope.dayMeal = [];
                for (var i = 1, j = 1; i <= days; i++, j++) {
                    $scope.mealDetails['day' + (i - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
                    $scope.dayMeal.push(i);
                    console.log(JSON.stringify($scope.mealDetails['day' + (i - 1)]));
                    console.log((i - 1));
                    //jQuery('#day' + (i - 1)).val(JSON.stringify($scope.mealDetails['day' + (i - 1)]));
                }
                console.log($scope.mealDetails);
            };
            $scope.saveMeal = function (day) {
                console.log(day);
                //console.log('Is empty object ' + checkIsMealEmpty($scope.mealDetails[day]));
                if (checkIsMealEmpty($scope.mealDetails[day]) == 'not empty') {
                    console.log('Has value');
                    jQuery('#' + day).val(JSON.stringify($scope.mealDetails[day]));
                    jQuery('#fill' + day.charAt(day.length - 1)).removeClass('filled-data').addClass('filldata');
                } else {
                    console.log('Empty');
                }
                //console.log(JSON.stringify($scope.mealDetails[day]));
                $scope.modal.hide();
            };

            $scope.submitmodal = function () {
                $scope.modal.hide();
                $scope.mealDetails[($scope.day - 1)] = [{time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}, {time: '', details: ''}];
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

        .controller('RecordsViewCtrl', function ($scope, $http, $state, $stateParams, $rootScope, $ionicLoading, $cordovaPrinter, $ionicModal, $timeout) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.category = [];
            $scope.catId = $stateParams.id;
            $scope.limit = 3;
            $scope.recId = [];
            $scope.recIds = [];
            $scope.userId = get('id');
            $scope.patientId = get('id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/get-records-details',
                params: {id: $stateParams.id, userId: $scope.userId, patientId: $scope.patientId, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.records = response.data.records;
                if ($scope.records.length != 0) {
                    if ($scope.records[0].record_metadata.length == 6) {
                        $scope.limit = 3; //$scope.records[0].record_metadata.length;
                    }
                }
                $scope.createdby = response.data.createdby;
                $scope.category = response.data.category;
                $scope.doctors = response.data.doctors;
                $scope.patient = response.data.patient;
                $scope.problems = response.data.problems;
                $scope.doctrs = response.data.shareDoctrs;
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getRecords = function (cat) {
                console.log(cat);
                $scope.catId = cat;
                //$stateParams.id = cat;
                $http({
                    method: 'GET',
                    url: domain + 'records/get-records-details',
                    params: {id: cat, userId: $scope.userId, interface: $scope.interface}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $scope.records = response.data.records;
                    if ($scope.records.length != 0) {
                        if ($scope.records[0].record_metadata.length == 6) {
                            $scope.limit = 3; //$scope.records[0].record_metadata.length;
                        }
                    }
                    $scope.doctrs = response.data.shareDoctrs;
                    //$scope.category = response.data.category;
                    console.log($scope.catId);
                }, function errorCallback(response) {
                    console.log(response);
                });
                $rootScope.$digest;
            };
            $scope.addRecord = function () {
                $state.go('app.add-category', {'id': button.id}, {reload: true});
            };
            //Delete Records by Category
            $scope.getRecIds = function (id) {
                console.log(id);
                if ($scope.recId[id]) {
                    $scope.recIds.push(id);
                } else {
                    var index = $scope.recIds.indexOf(id);
                    $scope.recIds.splice(index, 1);
                }
                console.log($scope.recIds);

            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Delete all Records by category
            $scope.delete = function () {
                if ($scope.recIds.length > 0) {
                    var confirm = window.confirm("Do you really want to delete?");
                    if (confirm) {
                        console.log($scope.recIds);
                        $http({
                            method: 'POST',
                            url: domain + 'records/delete-by-category',
                            params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId}
                        }).then(function successCallback(response) {
                            alert("Records deleted successfully!");
                            $timeout(function () {
                                window.location.reload();
                            }, 1000);
                        }, function errorCallback(e) {
                            console.log(e);
                        });
                    }
                } else {
                    alert("Please select records to delete!");
                }
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.recIds.length > 0) {
                    if ($scope.docId != '') {
                        var confirm = window.confirm("Do you really want to share?");
                        if (confirm) {
                            console.log($scope.recIds);
                            $http({
                                method: 'POST',
                                url: domain + 'records/share-by-category',
                                params: {ids: JSON.stringify($scope.recIds), userId: $scope.userId, docId: $scope.docId}
                            }).then(function successCallback(response) {
                                console.log(response);
                                if (response.data == 'Success') {
                                    alert("Records shared successfully!");
                                    $timeout(function () {
                                        window.location.reload();
                                    }, 1000);
                                }
                            }, function errorCallback(e) {
                                console.log(e);
                            });

                        }
                    } else {
                        alert("Please select doctor to share with!");
                    }
                } else {
                    alert("Please select records to share!");
                }
            };
            // Delete and share buttons hide show
            $scope.recordDelete = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec3').css('display', 'block');

            };
            $scope.recordShare = function () {
                jQuery('.selectrecord').css('display', 'block');
                jQuery('.btview').css('display', 'none');
                jQuery('#rec1').css('display', 'none');
                jQuery('#rec2').css('display', 'block');

            }
            $scope.CancelAction = function () {
                jQuery('.selectrecord').css('display', 'none');
                jQuery('.btview').css('display', 'block');
                jQuery('#rec1').css('display', 'block');
                jQuery('#rec2').css('display', 'none');
                jQuery('#rec3').css('display', 'none');
            };

            $scope.selectcheckbox = function ($event) {
                console.log($event);
                // if($event==true){
                // jQuery(this).addClass('asd123');
                // }
            };
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };


            $scope.print = function () {
                //  console.log("fsfdfsfd");
                //  var printerAvail = $cordovaPrinter.isAvailable();
                var print_page = '<img src="http://stage.doctrs.in/public/frontend/uploads/attachments/7V7Lr1456500103323.jpg"  height="600" width="300" />';
                //console.log(print_page);  
                cordova.plugins.printer.print(print_page, 'alpha', function () {
                    alert('printing finished or canceled');
                });
            };
        })

        .controller('RecordDetailsCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $ionicLoading, $rootScope, $sce) {
            $scope.recordId = $stateParams.id;
            $scope.userId = get('id');
            $scope.Bstatus = '';
            $scope.Istatus = '';
            $scope.repeatStatus = '';
            $scope.InvStatus = '';
            $scope.probstatus = '';
            $scope.prescstatus = '';
            $scope.selConditions = [];
            $scope.diet = [];
            $scope.dietPlanDetails = [];
            $scope.Mealday = '';
            $scope.isAttachment = '';
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.isNumber = function (num) {
                return angular.isNumber(num);
            };
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'records/get-record-details',
                params: {id: $stateParams.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                console.log(response.data);
                $scope.recordDetails = response.data.recordsDetails;
                $scope.category = response.data.record;
                $scope.problem = response.data.problem;
                $scope.doctors = response.data.doctrs;
                $scope.patient = response.data.patient;
                $scope.doctrs = response.data.shareDoctrs;
                $scope.selConditions = response.data.conditions;
                $scope.dietData = response.data.dietData;
                $scope.dietDetails = response.data.dietDetails;
                angular.forEach($scope.dietDetails, function (value, key) {
                    angular.forEach(value.data, function (val, k) {

                    });
                });
                angular.forEach($scope.recordDetails, function (val, key) {
                    if ($scope.category.categories.id == '7') {
                        console.log(val.fields.field);
                        if (val.fields.field == 'Status') {
                            $scope.Bstatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '19') {
                        if (val.fields.field == 'End Date') {
                            $scope.endtime = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '2') {
                        if (val.fields.field == 'Status') {
                            $scope.Istatus = val.value;
                        }
                        if (val.fields.field == 'Repeat') {
                            $scope.repeatStatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '5' || $scope.category.categories.id == '4') {
                        if (val.fields.field == 'Status') {
                            $scope.InvStatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '14') {
                        if (val.fields.field == 'Status') {
                            $scope.probstatus = val.value;
                        }
                    }
                    if ($scope.category.categories.id == '8') {
                        if (val.fields.field == 'Includes Prescription') {
                            $scope.prescstatus = val.value;
                        }
                    }
                    if (val.fields.field == 'Attachments') {
                        $scope.isAttachment = val.attachments.length;
                    }
                });
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            //DELETE Modal
            $scope.delete = function (id) {
                console.log($scope.category.category);
                $http({
                    method: 'POST',
                    url: domain + 'records/delete',
                    params: {id: id}
                }).then(function successCallback(response) {
                    alert("Record deleted successfully!");
                    $timeout(function () {
                        $state.go('app.records-view', {'id': $scope.category.category}, {}, {reload: true});
                        //$state.go('app.category-detail');
                    }, 1000);
                }, function errorCallback(e) {
                    console.log(e);
                });
            };
            $scope.getDocId = function (id) {
                console.log(id);
                $scope.docId = id;
            };
            //Share all records by Category
            $scope.share = function () {
                if ($scope.docId != '') {
                    var confirm = window.confirm("Do you really want to share?");
                    if (confirm) {
                        console.log($scope.recordId);
                        $http({
                            method: 'POST',
                            url: domain + 'records/share',
                            params: {id: $scope.recordId, userId: $scope.userId, docId: $scope.docId}
                        }).then(function successCallback(response) {
                            console.log(response);
                            if (response.data == 'Success') {
                                alert("Records shared successfully!");
                                $timeout(function () {
                                    window.location.reload();
                                }, 1000);
                            }
                        }, function errorCallback(e) {
                            console.log(e);
                        });

                    }
                } else {
                    alert("Please select doctor to share with!");
                }
            };


            //EDIT Modal
//            $scope.edit = function (id, cat) {
//                $state.go('app.edit-record', {'id': id, 'cat': cat});
//                //window.location.href = "http://192.168.2.169:8100/#/app/edit-record/" + id + "/" + cat;
//            };
            // Load the modal from the given template URL
            $ionicModal.fromTemplateUrl('filesview.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
                $scope.showm = function (path, name) {
                    console.log(path + '=afd =' + name);
                    $scope.value = $rootScope.attachpath + path + name;
                    $scope.modal.show();
                }

            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });
            $scope.trustSrc = function (src) {
                return $sce.trustAsResourceUrl(src);
            };

            $scope.submitmodal = function () {
                //console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('mealDetailsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('mealdetails', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.daymodal = function (day) {
                    $scope.dietPlanDetails = [];
                    console.log($scope.dietData[day]);
                    $scope.diet = $scope.dietData[day];
                    console.log('Day ' + day);
                    $scope.Mealday = (day + 1);
                    var i, j, temparray, chunk = 4;
                    for (i = 0, j = $scope.diet.length; i < j; i += chunk) {
                        $scope.dietPlanDetails.push($scope.diet.slice(i, i + chunk));
                    }
                    console.log($scope.dietPlanDetails);
                    $scope.modal.show();
                };
            });
            $scope.submitmodal = function () {
                //console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('shareModalCtrl', function ($scope, $http, $state, $stateParams, $timeout, $ionicModal, $rootScope, $sce) {
            //Show share model
            $ionicModal.fromTemplateUrl('share', {
                scope: $scope,
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.submitmodal = function () {
                console.log($scope.catIds);
                $scope.modal.hide();
            };
        })

        .controller('ConsultationsListCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.dnlink = function ($nurl) {
                $state.go($nurl);
            }
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
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
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

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

        .controller('ConsultationsListCurrentCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations-current',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
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
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

//            $scope.recordVideo = function () {
//                $state.go('app.doctor-record-join', {}, {cache: false}, {reload: true});
//            }

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

        .controller('ConsultationsListPastCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading, $filter, $ionicHistory) {
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.imgpath = domain;
            $scope.specializations = {};
            $scope.userId = get('id');
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/consultations-past',
                params: {userId: $scope.userId, interface: $scope.interface}
            }).then(function successCallback(response) {
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
                $scope.clinic_time = response.data.clinic_time;
                $scope.clinic_end_time = response.data.clinic_end_time;

                $scope.clinic_app_past = response.data.clinic_app_past;
                $scope.clinic_doctorsData_past = response.data.clinic_doctorsData_past;
                $scope.clinic_products_past = response.data.clinic_products_past;
                $scope.clinic_time_past = response.data.clinic_time_past;
                $scope.clinic_end_time = response.data.clinic_end_time;
                //Home
                $scope.home_app = response.data.home_app;
                $scope.home_doctorsData = response.data.home_doctorsData;
                $scope.home_products = response.data.home_products;
                //Chat 
                $scope.chat_app = response.data.chat_app;
                $scope.chat_doctorsData = response.data.chat_doctorsData;
                $scope.chat_products = response.data.chat_products;
                $ionicLoading.hide();
                //$state.go('app.category-detail');
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.deleteApp = function (appId, prodId, mode, startTime) {
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctorsapp/patient-delete-app',
                    params: {appId: appId, prodId: prodId, userId: $scope.userId}
                }).then(function successCallback(response) {
                    console.log(response.data);
                    $ionicLoading.hide();
                    if (response.data == 1) {
                        alert('Your appointment is cancelled successfully.');
                        $state.go('app.consultations-current', {}, {reload: true});
                    }
                    //$state.go('app.consultations-current', {}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

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
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicLoading.show({template: 'Loading...'});
            $scope.specId = $stateParams.id;
            $scope.userId = get('id');
            $scope.docServices = [];
            $http({
                method: 'GET',
                url: domain + 'doctors/list',
                params: {id: $stateParams.id, interface: $scope.interface}
            }).then(function successCallback(response) {
                $scope.doctors = response.data.user;
                $scope.services = response.data.services;
                angular.forEach($scope.doctors, function (value, key) {
                    $http({
                        method: 'GET',
                        url: domain + 'doctors/get-doctor-services',
                        params: {id: value.id, interface: $scope.interface}
                    }).then(function successCallback(responseData) {
                        $ionicLoading.hide();
                        console.log(responseData);
                        $scope.docServices[key] = responseData.data.data;
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                    $scope.spec = response.data.spec;
                    $ionicLoading.hide();
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
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-details',
                params: {id: $stateParams.id, interface: $scope.interface}
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
                $scope.service = response.data.service;
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
                        if (responseData.data.lastdate == '') {
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
                $ionicLoading.hide();
            });

            $scope.doit = function () {
                console.log("removeitem");
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
            };

            $scope.checkAvailability = function (uid, prodId) {
                $scope.interface = window.localStorage.getItem('interface_id');
                console.log("prodId " + prodId);
                console.log("uid " + uid);
                $rootScope.$broadcast('loading:hide');
                $ionicLoading.show();
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-doctor-availability',
                    params: {id: uid, interface: $scope.interface}
                }).then(function successCallback(responseData) {
                    if (responseData.data.status == 1) {
                        $state.go('app.checkavailable', {'data': prodId, 'uid': uid});
                    } else {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                    }
                });
            };
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key + "Seveice == " + serv);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd') + '+05:30:00';  // HH:mm:ss
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    //$ionicLoading.hide();
                    if (responseData.data.lastdate == '') {
                        if (serv == 1) {
                            $scope.vSch[key] = responseData.data.slots;
                            $scope.schdate[key] = new Date();
                            $scope.nextdate[key] = $filter('date')(new Date(), 'yyyy-MM-dd');
                            $rootScope.$digest;
                        } else if (serv == 3) {
                            console.log('Serv = if');
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
                            console.log('Serv = else');
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
                    $ionicLoading.hide();
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
                    //$ionicLoading.hide();
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
                    $ionicLoading.hide();
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
                        } else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
                    } else if (serv == 3 || serv == 4) {
                        if (checkLogin())
                        {
                            $ionicLoading.show({template: 'Loading...'});
                            console.log('2')
                            $state.go('app.payment');
                        } else {
                            $ionicLoading.show({template: 'Loading...'});
                            $state.go('auth.login');
                        }
                    }
                } else {
                    alert('Please select slot');
                }
            };
            $scope.bookChatAppointment = function (prodId, serv) {
                window.localStorage.setItem('prodId', prodId);
                //window.localStorage.setItem('url', 'app.payment');
                window.localStorage.setItem('mode', serv);
                $rootScope.prodid = prodId;
                $rootScope.url = 'app.payment';
                if (checkLogin()) {
                    $ionicLoading.show({template: 'Loading...'});
                    $state.go('app.payment');
                } else
                {
                    $ionicLoading.show({template: 'Loading...'});
                    $state.go('auth.login');
                }
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
            $scope.counter1 = 300;
            var stopped1;
            $scope.paynowcountdown = function () {
                stopped1 = $timeout(function () {
                    console.log($scope.counter1);
                    $scope.counter1--;
                    $scope.paynowcountdown();
                }, 1000);
                if ($scope.counter1 == 0) {
                    //console.log('fadsf af daf');
                    $timeout.cancel(stopped1);
                    $scope.kookooID = window.localStorage.getItem('kookooid1');
                    $scope.prodid = window.localStorage.getItem('prodId');
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/payment-time-expired',
                        params: {kookooid: $scope.kookooID}
                    }).then(function successCallback(responseData) {
                        $ionicLoading.hide();
                        alert('Sorry, Your payment time expired');
                        window.localStorage.removeItem('kookooid');
                        window.localStorage.removeItem('kookooid1');
                        $timeout(function () {
                            // $state.go('app.consultation-profile', {'id':$scope.product[0].user_id}, {reload: true});
                            $state.go('app.consultations-list', {reload: true});
                        }, 3000);
                    }, function errorCallback(response) {
                        $state.go('app.consultations-list', {reload: true});
                    });
                }
            };
            $timeout(function () {
                $scope.paynowcountdown();
            }, 0);
            $scope.mode = window.localStorage.getItem('mode');
            $scope.supid = window.localStorage.getItem('supid');
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $scope.prodid = window.localStorage.getItem('prodId');
            $scope.interface = window.localStorage.getItem('interface_id');
            $scope.apply = '0';
            $scope.ccode = '';
            $scope.curTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            $scope.discountApplied = '0';
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctors/get-order-review',
                params: {id: $scope.supid, prodId: $scope.prodid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                console.log(responseData.data);
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
                $timeout.cancel(stopped1);
                $ionicLoading.show({template: 'Loading...'});
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/book-appointment',
                    params: {prodId: $scope.prodid, userId: $scope.userId, supId: $scope.supid, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('app.thankyou', {'data': 'success'}, {reload: true});
                }, function errorCallback(response) {
                    console.log(response);
                });
            };
            $scope.payNow = function (finalamount) {
                $timeout.cancel(stopped1);
                $scope.interface = window.localStorage.getItem('interface_id');
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
                $scope.kookooID = window.localStorage.getItem('kookooid1');
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/buy-individual',
                    params: {interface: $scope.interface, kookooID: $scope.kookooID, ccode: $scope.ccode, discount: $scope.discount, disapply: $scope.discountApplied, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
                }).then(function successCallback(response) {
                    window.localStorage.removeItem('coupondiscount');
                    window.localStorage.setItem('coupondiscount', '')
                    console.log(response.data);
                    if (finalamount > 0) {
                        //$timeout.cancel(stopped1);
                        $state.go('app.Gopay', {'link': response.data});
                        console.log(response.data);
                    } else {
                        $scope.discountval = response.data.discount;
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        //$timeout.cancel(stopped1);
                        $ionicLoading.hide();
                        $state.go('app.thankyou', {'data': response.data}, {reload: true});
                    }
                }, function errorCallback(response) {
                    console.log(response);
                })
            };
            $scope.applyCouponCode = function (ccode) {
                $scope.apply = '0';
                $scope.discountApplied = '0';
                window.localStorage.setItem('coupondiscount', '0');
                $scope.interface = window.localStorage.getItem('interface_id');
                $scope.startSlot = window.localStorage.getItem('startSlot');
                $scope.endSlot = window.localStorage.getItem('endSlot');
                $scope.prodid = window.localStorage.getItem('prodId');
                $scope.appUrl = $location.absUrl();
                $scope.userId = get('id');
                $scope.ccode = ccode;
                console.log($scope.discount + '--' + $scope.discountApplied + '++++ ' + $scope.userId);
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'buy/apply-coupon-code',
                    params: {interface: $scope.interface, couponCode: ccode, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.startSlot, endSlot: $scope.endSlot}
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
                    $ionicLoading.hide();
                });
            }
            ;
        })

        .controller('ThankyouCtrl', function ($scope, $http, $state, $location, $stateParams, $rootScope, $ionicGesture, $timeout, $sce, $ionicHistory) {
            console.log($stateParams.data);
            $scope.data = $stateParams.data;
            $scope.gotohome = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                window.localStorage.removeItem('startSlot');
                window.localStorage.removeItem('endSlot');
                window.localStorage.removeItem('prodId');
                window.localStorage.removeItem('supid');
                window.localStorage.removeItem('mode');
                window.localStorage.removeItem('kookooid');
                window.localStorage.removeItem('kookooid1');
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

        .controller('SuccessCtrl', function ($scope, $http, $stateParams, $state, $ionicLoading) {
            $scope.startSlot = window.localStorage.getItem('startSlot');
            $scope.endSlot = window.localStorage.getItem('endSlot');
            $ionicLoading.show({template: 'Loading...'});
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
                $ionicLoading.hide();
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

        .controller('FailureCtrl', function ($scope, $http, $stateParams, $ionicLoading) {
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'orders/get-failure-order-details',
                params: {id: $stateParams.id, serviceId: $stateParams.serviceId}
            }).then(function successCallback(responseData) {
                $scope.product = responseData.data.prod;
                $scope.prod_inclusion = responseData.data.prod_inclusion;
                $scope.doctor = responseData.data.doctor;
                $ionicLoading.hide();
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
            $ionicLoading.show({template: 'Loading...'});
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
                $ionicLoading.hide();
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

        .controller('PatientJoinCtrl', function ($window, $scope, $http, $stateParams, $sce, $filter, $timeout, $state, $ionicHistory, $ionicLoading) {
            $ionicLoading.show({template: 'Loading...'});
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
                console.log('sessionId' + sessionId);
                var token = response.data.oToken;
                console.log('token' + token);
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

        .controller('ChatListCtrl', function ($scope, $http, $stateParams, $rootScope, $ionicLoading) {
            $scope.doctorId = window.localStorage.getItem('id');
            $scope.participant = [];
            $scope.msg = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-active-chats',
                params: {drid: $scope.doctorId}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.chatParticipants = response.data;
                angular.forEach($scope.chatParticipants, function (value, key) {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'doctorsapp/get-chat-msg',
                        params: {partId: value[0].participant_id, chatId: value[0].chat_id}
                    }).then(function successCallback(responseData) {
                        console.log(responseData);
                        $scope.participant[key] = responseData.data.user;
                        $scope.msg[key] = responseData.data.msg;
                        $rootScope.$digest;
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('PastChatListCtrl', function ($scope, $http, $stateParams, $rootScope, $ionicLoading) {
            $scope.doctorId = window.localStorage.getItem('id');
            $scope.participant = [];
            $scope.msg = [];
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-past-chats',
                params: {drid: $scope.doctorId}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.chatParticipants = response.data;
                angular.forEach($scope.chatParticipants, function (value, key) {
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'doctorsapp/get-chat-msg',
                        params: {partId: value[0].participant_id, chatId: value[0].chat_id}
                    }).then(function successCallback(responseData) {
                        console.log(responseData);
                        $scope.participant[key] = responseData.data.user;
                        $scope.msg[key] = responseData.data.msg;
                        $rootScope.$digest;
                        $ionicLoading.hide();
                    }, function errorCallback(response) {
                        console.log(response.responseText);
                    });
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });
        })

        .controller('ChatCtrl', function ($scope, $http, $stateParams, $timeout, $filter, $ionicLoading) {
            $scope.chatId = $stateParams.id;
            window.localStorage.setItem('chatId', $stateParams.id);
            $scope.partId = window.localStorage.getItem('id');
            $scope.msg = '';
            var apiKey = '45121182';
            //console.log($scope.chatId);
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'doctorsapp/get-chat-token',
                params: {chatId: $scope.chatId, userId: $scope.partId}
            }).then(function sucessCallback(response) {
                console.log(response.data);
                $scope.user = response.data.user;
                $scope.otherUser = response.data.otherUser;
                $scope.chatMsgs = response.data.chatMsgs;
                $scope.token = response.data.token;
                $scope.otherToken = response.data.otherToken;
                $scope.sessionId = response.data.chatSession;
                window.localStorage.setItem('Toid', $scope.otherUser.id);
                //$scope.connect("'" + $scope.token + "'");
                $scope.apiKey = apiKey;
                var session = OT.initSession($scope.apiKey, $scope.sessionId);
                $scope.session = session;
                var chatWidget = new OTSolution.TextChat.ChatWidget({session: $scope.session, container: '#chat'});
                console.log(chatWidget);
                session.connect($scope.token, function (err) {
                    if (!err) {
                        console.log("Connection success");
                    } else {
                        console.error(err);
                    }
                });
                $ionicLoading.hide();
            }, function errorCallback(e) {
                console.log(e);
            });

            $scope.returnjs = function () {
                jQuery(function () {
                    var wh = jQuery('window').height();
                    jQuery('#chat').css('height', wh);
                    //	console.log(wh);

                })
            };
            $scope.returnjs();
            $scope.iframeHeight = $(window).height() - 42;
            $('#chat').css('height', $scope.iframeHeight);
            //Previous Chat 
            $scope.appendprevious = function () {
                $(function () {
                    angular.forEach($scope.chatMsgs, function (value, key) {
                        var msgTime = $filter('date')(new Date(value.tstamp), 'hh:mm a');
                        if (value.sender_id == $scope.partId) {
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble mine" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        } else {
                            $('#chat .ot-textchat .ot-bubbles').append('<section class="ot-bubble" data-sender-id=""><div><header class="ot-bubble-header"><p class="ot-message-sender"></p><time class="ot-message-timestamp">' + msgTime + '</time></header><div class="ot-message-content">' + value.message + '</div></div></section>');
                        }
                    });
                })
            };
            $scope.movebottom = function () {
                jQuery(function () {
                    var dh = $('.ot-bubbles').height();
                    $('.chatscroll').scrollTop(dh);
                    //	console.log(wh);

                })
            };

            $timeout(function () {
                $scope.appendprevious();
                $scope.movebottom();
            }, 1000);

        })

        .controller('JoinChatCtrl', function ($scope, $http, $stateParams, $sce, $ionicLoading) {
            $scope.appId = $stateParams.id;
            $scope.mode = $stateParams.mode;
            $scope.userId = get('id');
            $scope.msgs = {};
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'chat/patient-join-chat',
                params: {id: $scope.appId, userId: $scope.userId, mode: $scope.mode}
            }).then(function sucessCallback(response) {
                $ionicLoading.hide();
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

        .controller('CheckavailableCtrl', function ($scope, $rootScope, $ionicLoading, $state, $http, $stateParams, $timeout, $ionicModal, $ionicPopup) {
            $scope.data = $stateParams.data;
            $scope.uid = $stateParams.uid;
            $scope.interface = window.localStorage.getItem('interface_id');
            $ionicLoading.show({template: 'Loading...'});
            $http({
                method: 'GET',
                url: domain + 'kookoo/check-doctor-availability',
                params: {id: $scope.uid, interface: $scope.interface}
            }).then(function successCallback(responseData) {
                $scope.check_availability = responseData.data.check_availability;
                $scope.instant_video = responseData.data.instant_video;
                $scope.language = responseData.data.lang.language;
                $ionicLoading.hide();
            });

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
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/reject-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            window.localStorage.removeItem('kookooid');
                            //$state.go('app.consultations-profile', {'data': $scope.prodid}, {reload: true});
                            $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    } else {
                        $http({
                            method: 'GET',
                            url: domain + 'kookoo/accept-by-patient',
                            params: {kookooid: $scope.kookooID}
                        }).then(function successCallback(patientresponse) {
                            console.log(patientresponse.data);
                            // window.localStorage.setItem('kookooid', response.data);
                            $state.go('app.payment', {}, {reload: true});
                        }, function errorCallback(patientresponse) {
                            //  alert('Oops something went wrong!');
                        });
                    }
                });
            };
            /*timer */
            $scope.IsVisible = false;
            $scope.counter = 60;
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
                var myListener = $rootScope.$on('loading:show', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListener);
                var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                    $ionicLoading.hide();
                });
                $scope.$on('$destroy', myListenern);
                $scope.$on('$destroy', function () {
                    $scope.checkavailval = 0;
                    console.log("jhffffhjfhj" + $scope.checkavailval);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');
                });
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/check-kookoo-value',
                    params: {kookooId: $scope.kookooID}
                }).then(function successCallback(responsekookoo) {
                    console.log(responsekookoo.data);
                    $scope.checkavailval = responsekookoo.data;
                    if ($scope.checkavailval == 1) {
                        $timeout.cancel(stopped);
                        $scope.showConfirm();
                        // $state.go('app.payment');

                    } else if ($scope.checkavailval == 2) {
                        $timeout.cancel(stopped);
                        window.localStorage.removeItem('kookooid');
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                    }
//                    if ($scope.counter == 1) {
//                        if (responsekookoo.data == 0)
//                        {
//                            $timeout.cancel(stopped);
//                            // $scope.showConfirm();
//                            // $state.go('app.payment');
//                            
//                            $http({
//                                method: 'GET',
//                                url: domain + 'kookoo/update-timer-expired',
//                                params: {kookooId: $scope.kookooID}
//                            }).then(function successCallback(responseexpired) {
//                                  window.localStorage.removeItem('kookooid');
//                                alert("Sorry. Your transaction's time limit has expired. Please try booking again");
//                                //$state.go('app.consultations-list', {}, {reload: true});
//                                 $state.go('app.consultation-profile', {'id':$scope.product[0].user_id}, {reload: true});
//                            }, function errorCallback(responseexpired) {
//
//                            });
//                        }
//                    }
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
                if ($scope.counter == 59) {
                    $scope.kookooID = window.localStorage.getItem('kookooid');
                    var myListener = $rootScope.$on('loading:show', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListener);
                    var myListenern = $rootScope.$on('loading:hide', function (event, data) {
                        $ionicLoading.hide();
                    });
                    $scope.$on('$destroy', myListenern);
                    $http({
                        method: 'GET',
                        url: domain + 'kookoo/check-doctrs-response',
                        params: {uid: $scope.uid, pid: window.localStorage.getItem('id')}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        if (response.data == '0')
                        {
                            alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                            $timeout.cancel(stopped);
                            $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
                            // alert('Doctor Not Available');
                        } else {
                            window.localStorage.setItem('kookooid', response.data);
                            window.localStorage.setItem('kookooid1', response.data);
                        }

                    }, function errorCallback(response) {
                        alert('Sorry. The specialist is currently unavailable. Please try booking a scheduled video or try again later.');
                        //$state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                        $state.go('app.consultation-profile', {'id': $scope.uid}, {reload: true});
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
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'kookoo/cancel-by-patient',
                    params: {kookooid: $scope.kookooID}
                }).then(function successCallback(patientresponse) {
                    console.log(patientresponse.data);
                    $timeout.cancel(stopped);
                    window.localStorage.removeItem('kookooid');
                    // $state.go('app.consultations-list', {reload: true});
                    $ionicLoading.hide();
                    $state.go('app.consultation-profile', {'id': $scope.product[0].user_id}, {reload: true});
                }, function errorCallback(patientresponse) {

                });
                // $scope.counter = 20;
            };
        })

        .controller('packagingCtrl', function ($scope) { })

        .controller('PackagingDetailCtrl', function ($scope, $ionicModal) {

        })

        .controller('pkgDetailsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('pkg-details', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
        })

        .controller('pkgtermsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('pkg-terms', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
        })

        .controller('infodoctrsCtrl', function ($scope, $ionicModal) {
            $ionicModal.fromTemplateUrl('infodoctrs', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });
        })

        .controller('packageConfirmCtrl', function ($scope, $ionicModal) {

        })

        /* packages */
        .controller('ActivePackagesCtrl', function ($scope) {})
        .controller('PackagesViewCtrl', function ($scope) {})
        .controller('PastPackagesCtrl', function ($scope) {})
        /* packages */

        /* Pathology */
        .controller('PathologyCtrl', function ($scope) {})
        .controller('PackagesListCtrl', function ($scope) {})
        /* Pathology */

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
                        $ionicLoading.show({template: 'Loading...'});
                        $http({
                            method: 'GET',
                            url: domain + 'appointment/cancel-app',
                            params: {appId: $scope.appId, userId: $scope.userId}
                        }).then(function successCallback(response) {
                            console.log(response.data);
                            $ionicLoading.hide();
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
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/cancel-app',
                        params: {appId: $scope.appId, userId: $scope.userId}
                    }).then(function successCallback(response) {
                        console.log(response.data);
                        $ionicLoading.hide();
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

        .controller('RescheduleAppointmentCtrl', function ($scope, $http, $ionicModal, $stateParams, $ionicLoading, $rootScope, $ionicHistory, $filter, $state) {
            $scope.pSch = [];
            $scope.schP = [];
            $scope.schdate = [];
            $scope.nextdate = [];
            $scope.appId = window.localStorage.getItem('appId');
            $ionicLoading.show({template: 'Loading...'});
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
                $ionicLoading.hide();
            }, function errorCallback(response) {
                console.log(response);
            });
            $scope.getNextSlots = function (nextDate, supsassId, key, serv) {
                console.log(nextDate + '=======' + supsassId + '=====' + key);
                var from = $filter('date')(new Date(nextDate), 'yyyy-MM-dd') + '+05:30:00';  // HH:mm:ss
                $ionicLoading.show({template: 'Loading...'});
                $http({
                    method: 'GET',
                    url: domain + 'doctors/get-doctors-availability',
                    cache: false,
                    params: {id: supsassId, from: from}
                }).then(function successCallback(responseData) {
                    console.log(responseData.data);
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
                    $ionicLoading.hide();
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
                    $ionicLoading.hide();
                }, function errorCallback(response) {
                    console.log(response);
                });
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
                    $ionicLoading.show({template: 'Loading...'});
                    $http({
                        method: 'GET',
                        url: domain + 'appointment/schedule-new-app',
                        params: {appId: $scope.appId, prodId: $scope.prodid, userId: $scope.userId, startSlot: $scope.bookingStart, endSlot: $scope.bookingEnd}
                    }).then(function successCallback(response) {
                        console.log(response);
                        $ionicLoading.hide();
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
        })
        ;
