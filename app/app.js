(function () {

    'use strict';

// Declare app level module which depends on views, and components
    angular.module('myApp', [
        'LocalStorageModule'
    ])
        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider.setStorageType('sessionStorage');
        })
        .controller('myAppCtrl', function ($scope, localStorageService) {
            //this is used for save the history of booked ticket
            $scope.userBookedHistory = [];

            //This is used for show/hide the booking seats display
            $scope.showSeatSelectionDiv = false;

            //Scope variabale which is used for track the info about user
            $scope.user = {
                name:null,
                noOfSeats:null,
                selectedSeats : []
            };

            //No of columns
            $scope.noOfColumn = [1,2,3,4,5,6,7,8,9,10,11,12];
            //No of rows
            $scope.noOfRow = ['A','B','C','D','E','F','G','H','I','J'];

            /**
             * This methos is used for inititate the app and load the previous history
             */
            $scope.initApp = function () {
                if(localStorageService.get("userBookedHistory")){
                    $scope.userBookedHistory = localStorageService.get("userBookedHistory");
                }
            };

            /**
             * This is used for set the class
             */
            angular.element(document).ready(function () {
                if($scope.userBookedHistory.length>0){
                    addBookedClass();
                }
            });

            /**
             * This method is used for start the selection process of sets and display the seats booking UI
             */
            $scope.startSelecting = function () {
                if($scope.user.name && $scope.user.noOfSeats){
                    $scope.showSeatSelectionDiv = true
                }else{
                    alert("Please enter your details")
                }
            };

            /**
             * This method is usdd for select the seat.
             * @param seatNum
             */
            $scope.selectSeat = function (seatNum) {
                if($scope.user.name && $scope.user.noOfSeats){
                    var indexOfSeatNumFromArr = $scope.user.selectedSeats.indexOf(seatNum);
                    var elem = angular.element("#"+seatNum).attr("class");
                    if(elem.indexOf("btn-danger")>-1){
                        //It means this seat is already booked.
                        alert("Oops! Please select another seat. This is already booked")
                    }else{
                        if($scope.user.noOfSeats>$scope.user.selectedSeats.length && indexOfSeatNumFromArr<0){
                            //Adding the success class and pushing the seat entry to selectedSeats array
                            angular.element("#"+seatNum).addClass("btn-success");
                            $scope.user.selectedSeats.push(seatNum)
                        }else{
                            if(indexOfSeatNumFromArr<0){
                                //It means seat limit has been reached which is entered by user.
                                alert("Seat limit has been reached")
                            }else{
                                //Here user is de - selecting the seat so we have to remove the success class as well as
                                //remove the entry from the array which we use for save the selected seats of user.
                                angular.element("#"+seatNum).removeClass("btn-success");
                                $scope.user.selectedSeats.splice(indexOfSeatNumFromArr,1)
                            }
                        }
                    }

                }else{
                    alert("Please Enter name and no of seats to book.")
                }

            };

            /**
             * This method is used for confirm the booking.
             */
            $scope.confirmBooking = function () {
                if($scope.user.name && $scope.user.noOfSeats == $scope.user.selectedSeats.length){
                    $scope.userBookedHistory.push($scope.user);
                    $scope.user = {
                        name:null,
                        noOfSeats:null,
                        selectedSeats : []
                    };
                    addBookedClass();
                    localStorageService.set("userBookedHistory",$scope.userBookedHistory);
                }else{
                    alert("Please enter details of your booking and select the seats")
                }

            };

            /**
             * This is used for add the booked class on seats
             */
            function addBookedClass() {
                $scope.userBookedHistory.forEach(function (userBookHis) {
                    userBookHis.selectedSeats.forEach(function (seatNum) {
                        angular.element("#"+seatNum).addClass("btn-danger");
                    })
                })
            }
        });
})();



