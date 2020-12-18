var app = angular.module("myApp", ["ui.router", "ngStorage", 'mainApp.services']);
var BASE_URL = "http://stjosephconventjalgaon.org/api/v1/";
let version = "0.0.0.1"

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('welcome', {
        url: 'admission',
        views: {
            'body': {
                templateUrl: `./registrationForm.html?v=${version}`,
                controller: 'frmController'
            }
        }
    })
    }
]);

app.run(
    ['$rootScope', '$location', '$http', '$q', '$state', '$stateParams', '$localStorage',
    function ($rootScope, $location, $http, $q, $state, $stateParams, $localStorage) {
        $state.transitionTo('welcome');
        //Here we check if user is not login and try to enter in system then must be redirected to login
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        });
    }]);
    
    
    app.controller("frmController", ['$scope', 'studentService', 'limitReachedService', '$window', 'addmissionService', '$localStorage', '$state','$location',
    function ($scope, studentService, limitReachedService, $window, addmissionService, $localStorage, $state, $location) {
        $scope.isVisible = false;
        $scope.isPresent = false;
        $scope.print = {};
        $scope.minDate = "";
        $scope.maxDate = "";
        $scope.dates = {};
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.years = {}
        $scope.year = "";
        $scope.status = [];
        $scope.showClass = false;
        $scope.religions = [{ name: 'Christian' }, { name: 'Hindu' }, { name: 'Muslim' }, { name: 'Sikh' }, { name: 'Jain' }, { name: 'Other' }];
        $scope.profession = [{ name: 'Farmer' }, { name: 'Doctor' }, { name: 'Teacher' }, { name: 'Government Service' }, { name: 'Private Job' }, { name: 'Advocate' }, { name: 'Railway' }, { name: 'Worker' }, { name: 'Driver' }, { name: 'Military' }, { name: 'Salesman' }, { name: 'Trader' }, { name: 'Business' }, { name: 'Agent' }, { name: 'Vendor' }, { name: 'Other' }];
        $scope.motherProfession = [{ name: 'House Wife' }, { name: 'Farmer' }, { name: 'Doctor' }, { name: 'Teacher' }, { name: 'Government Service' }, { name: 'Private Job' }, { name: 'Advocate' }, { name: 'Railway' }, { name: 'Worker' }, { name: 'Driver' }, { name: 'Military' }, { name: 'Salesman' }, { name: 'Trader' }, { name: 'Business' }, { name: 'Agent' }, { name: 'Vendor' }, { name: 'Other' }];
        $scope.incomes = [{ name: '1 lac and Above'}, { name: '2 lac and Above'}, { name: '3 lac and Above'}, { name: '4 lac and Above'}, { name: '5 lac and Above'}];
        $scope.standards = [{name: "Jr. KG"},{name: "Sr. KG."},{name: "1st Std."},{name: "2nd Std."},{name: "3rd Std."},{name: "4th Std."},{name: "5th Std."},{name: "6th Std."},{name: "7th Std."},{name: "8th Std."},{name: "9th Std."}];
        
        $scope.setRange = () => {
            studentService.getDateRange(function (response, status, headers, config) {
                if (response.status) {
                    $scope.dates = response.data;
                    $scope.minDate = $scope.dates.startDate;
                    $scope.maxDate = $scope.dates.endDate;
                    $scope.startDate = moment($scope.dates.startDate).format('DD-MM-YYYY');
                    $scope.endDate = moment($scope.dates.endDate).format('DD-MM-YYYY');
                }
            }, function (response, status, headers, config) {
            });
        }
        $scope.setRange();    
        
        $scope.setYear = () => {
            studentService.getYears(function (response, status, headers, config) {
                if (response.status) {
                    $scope.years = response.data;
                    $scope.year = $scope.years.years;
                }
            }, function (response, status, headers, config) {
            });
        }
        $scope.setYear();  
          
        //GET Status
        $scope.getStatus = () => {
            studentService.getClassStatus(function (response, status, headers, config) {
                if (response.status) {
                    $scope.status = response.data;
                    if($scope.status[1].status == true ){
                    $scope.showClass = true;
                    }
                }
            }, function (response, status, headers, config) {
            });
        }
        $scope.getStatus();
        
        $scope.showHide = function (data) {
            
            if (data === 'true') {
                $scope.isVisible = true;
            }
            else {
                $scope.isVisible = false;
            }
        }
        $scope.showPresent = function (data) {
            if (data === 'true') {
                $scope.isPresent = true;
            }
            else {
                $scope.isPresent = false;
            }
        }
        $scope.changeFormat = (data) => {
            let unformattedDate = moment(data).format('DD-MM-YYYY');
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var arr1 = unformattedDate.split('-');
            let date = $scope.convertDate(arr1[0]);
            let month = arr1[1];
            let year = $scope.convertDate(arr1[2]);
            let monthInWords = months[month - 1];
            $scope.student.dateText = date + monthInWords + ' ' + year;
        };
        
        //$scope.limitCheck = () => {
        //    limitReachedService.get(function (response, status, headers, config) {
        //        if (response.status) {
        
        //        }
        //    }, function (response, status, headers, config) {
        
        //    });
        //}
        
        $scope.confirmAddmission = (UID) => {
            // console.log(UID);
            addmissionService.get(UID, function (response, status, headers, config) {
                if (response.status) {
                    $scope.isVisible = response.status;
                    $scope.addmission = response.data;
                    // $state.go('printForm');
                    //    $localStorage.printData =  $scope.addmission;
                    //    $state.go('printForm');
                    // console.log("status");
                    // console.log($scope.addmission);
                    
                }
                else {
                    $scope.isVisible = response.status;
                    // console.log("$scope.isVisible ");
                    // console.log($scope.isVisible);
                }
            }, function (response, status, headers, config) {
                $scope.isVisible = response.status;
                $scope.notification = 'Sorry your child is not eligible for intrview.';
            });
        }
        
        $scope.printForm = (data) => {
            $localStorage.printData = data;
            $state.go('printForm');
        };
        
        if ($localStorage.printData !== undefined) {
            $scope.print = $localStorage.printData;
            //$scope.print.phone = $scope.print.phone.split("").reverse().join("");
        }
        
        //Print div
        $scope.printDiv = function (div) {
            PrintPanel(div);
        };
        
        $scope.registerStudent = (frmRegistration, data) => {
            
            if (frmRegistration.$invalid) {
                angular.forEach(frmRegistration.$error.required, function (field) {
                    field.$setDirty();
                });
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please fill in the required fields!',
                })
            }
            
            let telephone = data.stdCode + data.telephoneNumber;
            if( isNaN(telephone) ){
                telephone = 'N/A'
            } 
            if(data.officeAddressOfMothers === undefined || data.officeAddressOfMothers === '' || data.officeAddressOfMothers === null ){
                data.officeAddressOfMothers = 'N/A'
            }
            
            let newDate = moment(data.dateOfBirth).format('DD-MM-YYYY');
            $scope.studentData = {
                alternativeNumber: data.AlternativeNumber,
                className: data.className,
                aaddharNumber: data.adhaarNumber,
                pupilName: data.pupilFirstName,
                pupilMiddleName: data.pupilMiddleName,
                pupilSurname: data.pupilSurName,
                pupilDOB: newDate,
                dOBInWord: data.dateText,
                motherTongue: data.motherTounge,
                religion: data.religion,
                fathersName: data.fatherName,
                fathersMiddleName: data.fatherMiddleName,
                fathersSurname: data.fatherSurName,
                fathersProfession: data.professions,
                officeAddressOfFathers: data.officeAddress,
                mothersName: data.mothersName,
                mothersProfession: data.motherProfessions,
                officeAddressOfMothers: data.officeAddressOfMothers,
                annualIncome: data.annualIncome,
                homeAddress: data.homeAddress,
                phone: telephone,
                mobile: data.mobileNumber,
                exStudent: data.exCandidate,
                passingYear: data.passingYear,
                presentOwnBrother: data.presentElders,
                grNumber: data.grNo,
                classID: data.classId,
                gender: data.gender
            };
            if( $scope.studentData.passingYear === undefined ||  $scope.studentData.passingYear === '' ||  $scope.studentData.passingYear === null ){
                $scope.studentData.passingYear = 'N/A'
            }
            if( $scope.studentData.grNumber === undefined ||  $scope.studentData.grNumber === '' ||  $scope.studentData.grNumber === null ){
                $scope.studentData.grNumber = 'N/A'
            }
            if( $scope.studentData.classID === undefined ||  $scope.studentData.classID === '' ||  $scope.studentData.classID === null ){
                $scope.studentData.classID = 'N/A'
            }
            console.log( $scope.studentData);
            studentService.registerUser($scope.studentData,
                function (response, status, headers, config) {
                    
                    if (response.status) {
                        // Swal.fire({
                        //     title: '<strong style="color: rgba(0,0,0,.65);font-weight: 600;text-transform: none;position: relative;display: block;padding: 13px 16px;font-size: 27px;line-height: normal; text-align: center;">Registration Successful!</strong> ',
                        //     icon: 'success',
                        //     html:
                        //       '<b style="font-size:21px">INSTRUCTION</b>  ' +
                        //       '<ul style="list-style-type:none;line-height: 30px;"> <li>Meeting with principal on 24 <sup>th</sup> January 2020 between <span style="color:red"> 10:00 a.m To 02:00 p.m<span> </li></ul> ',
                        //     focusConfirm: false,
                        //     confirmButtonText:
                        //       'Proceed!',
                        //     confirmButtonAriaLabel: 'Thumbs up, great!',
                        //     allowOutsideClick: false,
                        
                        
                        //   }).then((result) => {
                        //     if (result.value) {
                        //        $state.go('printForm');
                        //     }
                        //   })
                        $state.go('success');
                        
                        //    $localStorage.printData = $scope.studentData;
                        $scope.student = {};
                        frmRegistration.$setPristine();
                        frmRegistration.$setUntouched();
                        //$scope.limitCheck();
                    }
                    else {
                        swal("Oops!", "Please enter mendatory fields.", "error");
                        // swal(response.message);
                    }
                }, function (response, status, headers, config) {
                    if (!response.status) {
                        swal("Oops!", response.message, "error");
                    }
                });
                
            };
            
            $scope.convertDate = function (date) {
                var words = new Array();
                words[0] = '';
                words[1] = 'One';
                words[2] = 'Two';
                words[3] = 'Three';
                words[4] = 'Four';
                words[5] = 'Five';
                words[6] = 'Six';
                words[7] = 'Seven';
                words[8] = 'Eight';
                words[9] = 'Nine';
                words[10] = 'Ten';
                words[11] = 'Eleven';
                words[12] = 'Twelve';
                words[13] = 'Thirteen';
                words[14] = 'Fourteen';
                words[15] = 'Fifteen';
                words[16] = 'Sixteen';
                words[17] = 'Seventeen';
                words[18] = 'Eighteen';
                words[19] = 'Nineteen';
                words[20] = 'Twenty';
                words[30] = 'Thirty';
                words[40] = 'Forty';
                words[50] = 'Fifty';
                words[60] = 'Sixty';
                words[70] = 'Seventy';
                words[80] = 'Eighty';
                words[90] = 'Ninety';
                date = date.toString();
                var atemp = date.split(".");
                var number = atemp[0].split(",").join("");
                var n_length = number.length;
                var words_string = "";
                if (n_length <= 9) {
                    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                    var received_n_array = new Array();
                    for (var i = 0; i < n_length; i++) {
                        received_n_array[i] = number.substr(i, 1);
                    }
                    for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
                        n_array[i] = received_n_array[j];
                    }
                    for (var i = 0, j = 1; i < 9; i++ , j++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            if (n_array[i] == 1) {
                                n_array[j] = 10 + parseInt(n_array[j]);
                                n_array[i] = 0;
                            }
                        }
                    }
                    value = "";
                    for (var i = 0; i < 9; i++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            value = n_array[i] * 10;
                        } else {
                            value = n_array[i];
                        }
                        if (value != 0) {
                            words_string += words[value] + " ";
                        }
                        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Crores ";
                        }
                        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Lakhs ";
                        }
                        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Thousand ";
                        }
                        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                            words_string += "Hundred and ";
                        } else if (i == 6 && value != 0) {
                            words_string += "Hundred ";
                        }
                    }
                    words_string = words_string.split("  ").join(" ");
                }
                return words_string;
            }
        }]);
        
        app.controller("homeController", ['$scope', 'limitReachedService',
        function ($scope, limitReachedService) {
            
            $scope.popup = function () {
                $(".check-icon").hide();
                setTimeout(function () {
                    $(".check-icon").show();
                }, 10);
            }
            
            $scope.isVisible = false;
            $scope.limitCheck = () => {
                limitReachedService.get(function (response, status, headers, config) {
                    if (response.status) {
                        $scope.isVisible = response.data;
                    }
                }, function (response, status, headers, config) {
                    
                });
            }
            $scope.limitCheck();
            
            //Print div
            $scope.printDiv = function (div) {
                PrintPanel(div);
            };
            
        }]);
        
        function PrintPanel(div) {
            var panel = document.getElementById(div);
            var printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write('<html><head><title>DIV Contents</title><style></style>' + '<link href="./assets/bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet" />');
            printWindow.document.write('</head><body >');
            printWindow.document.write(panel.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            setTimeout(function () {
                printWindow.print();
            }, 500);
            return false;
        }
        