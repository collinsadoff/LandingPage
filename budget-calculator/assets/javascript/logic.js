

// On page load
$(document).ready(function () {
    // for some reason we can't get the styling to work on this button unless it does not start hidden, so it gets hidden right away
    $("#percentageAllocatorButton").hide();
    // budgetInfo object contains all necessary variables
    var budgetInfo = {
        //user inputs total amount of $ to track
        spendingMoney: 0,
        trackingPercents: false,
        //array for user inputted budgetItems
        budgetItems: [],
        incomeSubmitted: false,
        categoriesSelected: false,
        //user will determine which categories to track, and % of spendingMoney allocated
        categories: {
            catFood: {
                name: "Food",
                isTracked: false,
                totalSpent: 0,
                percentage: 0
            },
            catClothing: {
                name: "Clothing",
                isTracked: false,
                totalSpent: 0,
                percentage: 0
            },
            catEntertainment: {
                name: "Entertainment",
                isTracked: false,
                totalSpent: 0,
                percentage: 0
            },
            catSavings: {
                name: "Savings",
                isTracked: true,
                totalSpent: 0,
                percentage: 0
            },
            catTransportation: {
                name: "Transportation",
                isTracked: false,
                totalSpent: 0,
                percentage: 0
            },
            catOther: {
                name: "Other",
                isTracked: true,
                totalSpent: 0,
                percentage: 0
            },
        },
        //budgetInfo object end
    };

    // pie chart
    var ctx = $("#myChart");
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            // categoies will be pushed to the array below
            labels: JSON.parse(localStorage.getItem("Labels")),
            datasets: [{
                // percent allocations will be pushed to the array below
                data: JSON.parse(localStorage.getItem("Data")),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(144, 0, 32, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(0, 102, 0, 0.8)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
        }
    }); // end of pie chart

    // pie chart storage
    var pieCloset = function () {
        var pieLabel = myChart.data.labels;
        var pieData = myChart.data.datasets[0].data;
        localStorage.setItem("Labels", JSON.stringify(pieLabel));
        localStorage.setItem("Data", JSON.stringify(pieData));

    }

    var pieChartPush = function (tooltip, allocation) {

        myChart.data.datasets[0].data.push(allocation);
        myChart.data.labels.push(tooltip);
        myChart.update();
        pieCloset();
    };

    var pieChartIf = function () {
        var foodPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catFood.percentage * 0.01));
        var clothingPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catClothing.percentage * 0.01));
        var entertainmentPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catEntertainment.percentage * 0.01));
        var savingsPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catSavings.percentage * 0.01));
        var trnsportationPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catTransportation.percentage * 0.01));
        var otherPie = Math.floor(budgetInfo.spendingMoney * (budgetInfo.categories.catOther.percentage * 0.01));
        if (budgetInfo.categories.catFood.percentage > 0) {
            pieChartPush("Food", foodPie);
        }
        if (budgetInfo.categories.catClothing.percentage > 0) {
            pieChartPush("Clothing", clothingPie);
        };
        if (budgetInfo.categories.catEntertainment.percentage > 0) {
            pieChartPush("Entertainment", entertainmentPie);
        };
        if (budgetInfo.categories.catSavings.percentage > 0) {
            pieChartPush("Savings", savingsPie);
        };
        if (budgetInfo.categories.catTransportation.percentage > 0) {
            pieChartPush("Transportation", trnsportationPie);
        };
        if (budgetInfo.categories.catOther.percentage > 0) {
            pieChartPush("Other", otherPie);
        };
    };

    var displaySavedBudgetInfo = function (inclHdr, makeTable) {
        var bArr = budgetInfo.budgetItems;
        var html = "";

        console.log("dsbi : " + bArr.length);

        // maybe a simple table looks better than what existing outPutter() does  ?    AC 02/17/2018
        /*   for (var i = 0; i < bArr.length; i++) {
            outPutter(bArr[i][0], bArr[i][1]);
        } */
        // if user refreshed after submitting total spending money, display checkboxes
        if (budgetInfo.incomeSubmitted === true && budgetInfo.categoriesSelected === false && budgetInfo.trackingPercents === false) {
            $("#categoryCheckbox").toggle();
            $("#userInputDollars").toggle();
            $("#prompt").html("<h2>What categories would you like to keep track of?</h2>");
        }
        // if user refreshed after submitting total spending money and selecting categories to track, but before allocating percentages, display allocator with correct categories
        if (budgetInfo.incomeSubmitted === true && budgetInfo.categoriesSelected === true && budgetInfo.trackingPercents === false) {
            allocationToggler();
            $("#percentageAllocator").toggle();
            $("#percentageAllocatorButton").toggle();
            $("#userInputDollars").toggle();
            $("#submit").toggle();
            $("#prompt").html("<h2>How much of your budget would you like allocated to each category (adding up to 100)?</h2>");
        }
        // if user refreshed after submitting total spending money, selecting categories to track, and allocating percentages but before adding any budget items, display radio buttons based on categories previously selected
        if (budgetInfo.incomeSubmitted === true && budgetInfo.categoriesSelected === true && budgetInfo.trackingPercents === true) {
            radioToggler();
            $("#prompt").html("<h2>Welcome back! Buy something new?</h2>");
        }

        // we have budget items
        if (bArr.length > 0) {
            radioToggler();
            $("#prompt").html("<h2>Welcome back! Buy something new?</h2>");
            if (!makeTable) {

                for (var i = 0; i < bArr.length; i++) {

                    $("#output").append("Category: " + bArr[i].category + " ");
                    $("#output").append("Cost: " + "$" + bArr[i].dollarAmount + "<br\>");

                    console.log("budgetCategory: " + bArr[i].category + "   budgetAmount: " + bArr[i].dollarAmount);
                }

            } else {

                // write the table header to html string
                // note with bulma class "table", which presents well but
                // seems to default to white background - may need modification

                html = '<table class="table" >'

                if (inclHdr) {
                    html += '<thead><tr><th style="font-weight:normal">Category</th><th style="font-weight:normal;text-align:right">Cost</th></tr></thead > ';
                }
                html += '<tbody> ';

                for (var i = 0; i < bArr.length; i++) {

                    // append each row of the table
                    html += '<tr><td>' + bArr[i].category + '</td><td style="text-align:right">' + '$' + bArr[i].dollarAmount + '</td></tr>';
                    console.log("budgetCategory: " + bArr[i].category + "   budgetAmount: " + bArr[i].dollarAmount);
                }

                // end the table
                html += "</tbody></table>";

                // and append the html to output div -- jquery append closes tags
                // ergo multiple cals to append do not work correctly in this scenario
                $("#output").append(html);
            }
        }
    }

    // Get and Set local storage functions
    var getBudgetInfoFromStorage = function () {

        var budgetObject = localStorage.getItem('budObject');
        //console.log(budetObject.spendingMoney);
        if (budgetObject != null) {
            budgetInfo = JSON.parse(budgetObject);
            console.log("spend : " + budgetInfo.spendingMoney);
        }

        // where & which fields from a saved budgetInfo object need to be displayed ?
        // that could go here, or call a function here to do it
        displaySavedBudgetInfo(true, true);
        // argument 1 - include a header, only for a table
        // arguemnt 2 - display in table format

    }

    var setBudgetInfoToStorage = function () {

        // clear ?
        // localStorage.clear()

        // clears all local storage, not just our "budObject"  -- this way, without clear((),// should just
        // replace, which should be adequate

        localStorage.setItem('budObject', JSON.stringify(budgetInfo));

        // where will this need to be called, so that data is saved on exit ?   bottom of last on click  ?
    }

    var radioToggler = function () {
        if (budgetInfo.categories.catFood.isTracked == true) {
            $(".foodR").show();
        }
        if (budgetInfo.categories.catClothing.isTracked == true) {
            $(".clothingR").show();
        }
        if (budgetInfo.categories.catEntertainment.isTracked == true) {
            $(".entertainmentR").show();
        }
        if (budgetInfo.categories.catTransportation.isTracked == true) {
            $(".transportationR").show();
        }
        if (budgetInfo.categories.catOther.isTracked == true) {
            $(".otherR").show();
        }
    };
    var allocationToggler = function () {
        if (budgetInfo.categories.catFood.isTracked == true) {
            $(".foodP").show();
        }
        if (budgetInfo.categories.catClothing.isTracked == true) {
            $(".clothingP").show();
        }
        if (budgetInfo.categories.catEntertainment.isTracked == true) {
            $(".entertainmentP").show();
        }
        if (budgetInfo.categories.catSavings.isTracked == true) {
            $(".savingsP").show();
        }
        if (budgetInfo.categories.catTransportation.isTracked == true) {
            $(".transportationP").show();
        }
        if (budgetInfo.categories.catOther.isTracked == true) {
            $(".otherP").show();
        }
    }
    //function that allows user to add items to the budget array based on category and dollar amount
    var addBudgetItem = function (cat, dollars) {
        budgetInfo.budgetItems.push({
            category: cat,
            dollarAmount: dollars
        });
        // based on category of new budget item, set totalSpent value of that category to current value + cost of new budget item (this will keep a running tally of each category right in the budgetInfo categories object)
        if (cat === "Food") {
            budgetInfo.categories.catFood.totalSpent += dollars;
        } else if (cat === "Clothing") {
            budgetInfo.categories.catClothing.totalSpent += dollars;
        } else if (cat === "Entertainment") {
            budgetInfo.categories.catEntertainment.totalSpent += dollars;
        } else if (cat === "Transportation") {
            budgetInfo.categories.catTransportation.totalSpent += dollars;
        } else if (cat === "Other") {
            budgetInfo.categories.catOther.totalSpent += dollars;
        }
        $("#prompt").html("<h2>Got it! Wanna add anything else?</h2>");
        setBudgetInfoToStorage();
    };
    // global variable
    var catTotalDollarAmount;
    var outPutter = function (appendCategory, appendCost) {
        // based on category and cost of last budget item, output the following information: total $ spent in that category, what % of total allocation has been spent so far, and $ remaining for that category

        var html = "";
        var bArr = budgetInfo.budgetItems;
        var inclHdr = true;

        if (appendCategory === "Food") {
            catTotalDollarAmount = budgetInfo.categories.catFood.totalSpent;
            $("#additionalInfo").html("You've spent $" + catTotalDollarAmount + " total in " + appendCategory + " so far. That's " + Math.floor((catTotalDollarAmount / (budgetInfo.spendingMoney * (budgetInfo.categories.catFood.percentage * 0.01)) * 100)) + "% of your allocation for that category, you have $" + (budgetInfo.spendingMoney * (budgetInfo.categories.catFood.percentage * 0.01) - catTotalDollarAmount) + " remaining in that category.");
        } else if (appendCategory === "Clothing") {
            catTotalDollarAmount = budgetInfo.categories.catClothing.totalSpent;
            $("#additionalInfo").html("You've spent $" + catTotalDollarAmount + " total in " + appendCategory + " so far. That's " + Math.floor((catTotalDollarAmount / (budgetInfo.spendingMoney * (budgetInfo.categories.catClothing.percentage * 0.01)) * 100)) + "% of your allocation for that category, you have $" + (budgetInfo.spendingMoney * (budgetInfo.categories.catClothing.percentage * 0.01) - catTotalDollarAmount) + " remaining in that category.");
        } else if (appendCategory === "Entertainment") {
            catTotalDollarAmount = budgetInfo.categories.catEntertainment.totalSpent;
            $("#additionalInfo").html("You've spent $" + catTotalDollarAmount + " total in " + appendCategory + " so far. That's " + Math.floor((catTotalDollarAmount / (budgetInfo.spendingMoney * (budgetInfo.categories.catEntertainment.percentage * 0.01)) * 100)) + "% of your allocation for that category, you have $" + (budgetInfo.spendingMoney * (budgetInfo.categories.catEntertainment.percentage * 0.01) - catTotalDollarAmount) + " remaining in that category.");
        } else if (appendCategory === "Transportation") {
            catTotalDollarAmount = budgetInfo.categories.catTransportation.totalSpent;
            $("#additionalInfo").html("You've spent $" + catTotalDollarAmount + " total in " + appendCategory + " so far. That's " + Math.floor((catTotalDollarAmount / (budgetInfo.spendingMoney * (budgetInfo.categories.catTransportation.percentage * 0.01)) * 100)) + "% of your allocation for that category, you have $" + (budgetInfo.spendingMoney * (budgetInfo.categories.catTransportation.percentage * 0.01) - catTotalDollarAmount) + " remaining in that category.");
        } else if (appendCategory === "Other") {
            catTotalDollarAmount = budgetInfo.categories.catOther.totalSpent;
            $("#additionalInfo").html("You've spent $" + catTotalDollarAmount + " total in " + appendCategory + " so far. That's " + Math.floor((catTotalDollarAmount / (budgetInfo.spendingMoney * (budgetInfo.categories.catOther.percentage * 0.01)) * 100)) + "% of your allocation for that category, you have $" + (budgetInfo.spendingMoney * (budgetInfo.categories.catOther.percentage * 0.01) - catTotalDollarAmount) + " remaining in that category.");
        }
        // always display last added budget item's category and cost

        if (1 === 1) { // note - always true, this will execute
            // but we can easily flip the switch if need be
            // and go back to the original format in the "else"

            $("#output").empty(); // WILL THIS ONLY BE THE TABLE ?

            html = '<table class="table" >'

            if (inclHdr) {

                html += '<thead style="background-color: rgb(189, 250, 229)"    > <tr><th style="font-weight:normal">Category</th><th style="font-weight:normal;text-align:right">Cost</th></tr></thead > ';
            }
            html += '<tbody> ';

            for (var i = 0; i < bArr.length; i++) {

                // append each row of the table
                html += '<tr style="background-color: rgb(189, 250, 229)"><td>' + bArr[i].category + '</td><td style="text-align:right">' + '$' + bArr[i].dollarAmount + '</td></tr>';
                console.log("budgetCategory: " + bArr[i].category + "   budgetAmount: " + bArr[i].dollarAmount);
            }

            // end the table
            html += "</tbody></table>";

            // had trouble testing this with the other table :
            // if there are stored budget items, how  does one enter more ?
            // each table seems to work correctly on its own, but i suspect
            // we'll end up with 2 header if there is both stored and new
            // budget items to be displayed

            $("#output").append(html);
        } else {
            // original format - if table looks right, can be deleted
            $("#output").append("Category: " + appendCategory + " ");
            $("#output").append("Cost: " + "$" + appendCost + "<br\>");
        }
    };

    // listens to the inputs of each percentage allocater field, when user presses a key in each percentage allocater input fields, convert what they've typed to the correct $ amount and display it in the span for that category
    $(".inputP").keyup(function () {
        if ($(this).prop("id") === "catSavingsInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catSavingsConverted").html("$" + conversion);
        }
        if ($(this).prop("id") === "catFoodInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catFoodConverted").html("$" + conversion);
        }
        if ($(this).prop("id") === "catClothingInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catClothingConverted").html("$" + conversion);
        }
        if ($(this).prop("id") === "catEntertainmentInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catEntertainmentConverted").html("$" + conversion);
        }
        if ($(this).prop("id") === "catTransportationInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catTransportationConverted").html("$" + conversion);
        }
        if ($(this).prop("id") === "catOtherInput") {
            var conversion = Math.floor((budgetInfo.spendingMoney * ($(this).val() * 0.01)));
            $("#catOtherConverted").html("$" + conversion);
        }
    });

    // big ugly reset that clears local storage, sets all variables of the budgetInfo object to default, and resets DOM to initial display
    $("#reset").on("click", function () {
        var reset = confirm("Are you sure? This will reset ALL stored data.");
        if (reset == true) {
            localStorage.clear();
            catTotalDollarAmount = undefined;
            budgetInfo.spendingMoney = 0;
            budgetInfo.incomeSubmitted = false;
            budgetInfo.categoriesSelected = false;
            budgetInfo.trackingPercents = false;
            budgetInfo.budgetItems = [];
            budgetInfo.categories.catFood.isTracked = false;
            budgetInfo.categories.catFood.totalSpent = 0;
            budgetInfo.categories.catFood.percentage = 0;
            budgetInfo.categories.catClothing.isTracked = false;
            budgetInfo.categories.catClothing.totalSpent = 0;
            budgetInfo.categories.catClothing.percentage = 0;
            budgetInfo.categories.catEntertainment.isTracked = false;
            budgetInfo.categories.catEntertainment.totalSpent = 0;
            budgetInfo.categories.catEntertainment.percentage = 0;
            budgetInfo.categories.catSavings.isTracked = true;
            budgetInfo.categories.catSavings.totalSpent = 0;
            budgetInfo.categories.catSavings.percentage = 0;
            budgetInfo.categories.catTransportation.isTracked = false;
            budgetInfo.categories.catTransportation.totalSpent = 0;
            budgetInfo.categories.catTransportation.percentage = 0;
            budgetInfo.categories.catOther.isTracked = false;
            budgetInfo.categories.catOther.totalSpent = 0;
            budgetInfo.categories.catOther.percentage = 0;
            myChart.data.datasets[0].data = [];
            myChart.data.labels = [];
            myChart.update();
            $("#catSavingsInput").val("0");
            $("#catFoodInput").val("0");
            $("#catClothingInput").val("0");
            $("#catEntertainmentInput").val("0");
            $("#catTransportationInput").val("0");
            $("#catOtherInput").val("0");
            $("#userInputDollars").val("");
            $("#output").empty();
            $("#additionalInfo").empty();
            $(".radioB").hide();
            $(".inputP").hide();
            $("#categoryCheckbox").hide();
            $("#percentageAllocatorButton").hide();
            $("#percentageAllocator").hide();
            $("#catSavingsConverted").empty();
            $("#catFoodConverted").empty();
            $("#catClothingConverted").empty();
            $("#catEntertainmentConverted").empty();
            $("#catTransportationConverted").empty();
            $("#catOtherConverted").empty();
            $("#submit").show();
            $("#userInputDollars").show();
            $(".checkbox").prop("checked", false);
            $(".radioB").prop("checked", false);
            $("#prompt").html("<h2>After fixed costs, how much do you have leftover to spend?</h2>");
        } else return;
    });

    //sets the variables in the budgetInfo object
    var checkboxChecker = function (whichCheckboxAreYou, isTrackedBool) {
        budgetInfo.categories[whichCheckboxAreYou].isTracked = isTrackedBool;
    };

    // listens for any changes to a element with the checkbox class, determines the value of the checkbox input and if it is checked or unchecked, and passes those values to the checkboxChecker function
    $(".checkbox").change(function () {
        var whichCheckboxAreYou = $(this).val();
        var isTrackedBool = $(this).prop("checked");
        checkboxChecker(whichCheckboxAreYou, isTrackedBool);
    });

    // new button for allocating percents, only displayed if user selects "yes" when asked if they want to track percents
    $("#percentageAllocatorButton").on("click", function () {
        // set local variable percentTotal to the total amount entered in the percentage allocator fields, each input defaults to 0
        var percentTotal = (parseInt($("#catFoodInput").val(), 10) + parseInt($("#catClothingInput").val(), 10) + parseInt($("#catEntertainmentInput").val(), 10) + parseInt($("#catSavingsInput").val(), 10) + parseInt($("#catTransportationInput").val(), 10) + parseInt($("#catOtherInput").val(), 10));
        // if the percents total more than 100, display error message and return
        if (percentTotal != 100) {
            $("#prompt").html("<h2>Please ensure total allocation equals 100%</h2>");
            console.log(percentTotal);
            return;
        } else {
            $("#userInputDollars").val("");
            budgetInfo.trackingPercents = true;
            $("#percentageAllocator").toggle();
            $("#submit").toggle();
            $("#percentageAllocatorButton").toggle();
            radioToggler();
            $("#userInputDollars").toggle();
            $("#prompt").html("<h2>Great! Let's get to tracking your budget. What'd you buy and how much did you spend?</h2>");
            // converts entered values to integers and sets the allocated percentages in the budgetInfo object. since default values are set to 0, when we only display categories the user has selected to track this functionality should remain intact
            budgetInfo.categories.catFood.percentage = parseInt($("#catFoodInput").val(), 10);
            budgetInfo.categories.catClothing.percentage = parseInt($("#catClothingInput").val(), 10);
            budgetInfo.categories.catEntertainment.percentage = parseInt($("#catEntertainmentInput").val(), 10);
            budgetInfo.categories.catSavings.percentage = parseInt($("#catSavingsInput").val(), 10);
            budgetInfo.categories.catTransportation.percentage = parseInt($("#catTransportationInput").val(), 10);
            budgetInfo.categories.catOther.percentage = parseInt($("#catOtherInput").val(), 10);
            // set the "totalSpent" of the Savings category based on allocated percentage
            budgetInfo.categories.catSavings.totalSpent = (budgetInfo.spendingMoney * (budgetInfo.categories.catSavings.percentage * 0.01));
            pieChartIf();
        }

        setBudgetInfoToStorage();
    });
    // when button is clicked, pass userInput values as arguments through both above functions, adding input to the budgetItems array and pushing to DOM
    $("#submit").on("click", function () {
        if (budgetInfo.incomeSubmitted === false && $("#userInputDollars").val() != "") {
            // convert user input from string to integer, using base 10 radix (ensures it converts to the decimal system we humans use)
            budgetInfo.spendingMoney = parseInt($("#userInputDollars").val(), 10);
            budgetInfo.incomeSubmitted = true;
            $("#categoryCheckbox").toggle();
            $("#userInputDollars").toggle();
            $("#prompt").html("<h2>What categories would you like to keep track of?</h2>");
            //this does not call a function because all of it's functionality happens within the ".change" function that calls checkboxchecker
        } else if (budgetInfo.incomeSubmitted === true && budgetInfo.categoriesSelected === false && $('.checkbox').is(':checked')) {
            budgetInfo.categoriesSelected = true;
            $("#categoryCheckbox").toggle();
            $("#submit").toggle();
            allocationToggler();
            $("#percentageAllocator").toggle();
            $("#percentageAllocatorButton").toggle();
            $("#prompt").html("<h2>How much of your budget would you like allocated to each category (adding up to 100)?</h2>");
        } else if (budgetInfo.incomeSubmitted === true && budgetInfo.categoriesSelected === true && budgetInfo.trackingPercents === true && $("#userInputDollars").val() != "" && $('.radioB').is(':checked')) {
            // sets the variable "stageThreeCat" according to which radio button is selected and that is pushed to outputter() and addBudgetItem()
            if ($("#radioFood").prop("checked") == true) {
                var stageThreeCat = "Food"
            } else if ($("#radioClothing").prop("checked") == true) {
                var stageThreeCat = "Clothing"
            } else if ($("#radioEntertainment").prop("checked") == true) {
                var stageThreeCat = "Entertainment"
            } else if ($("#radioTransportation").prop("checked") == true) {
                var stageThreeCat = "Transportation"
            } else if ($("#radioOther").prop("checked") == true) {
                var stageThreeCat = "Other"
            };
            var stageThreeCost = parseInt($("#userInputDollars").val(), 10);
            addBudgetItem(stageThreeCat, stageThreeCost);
            outPutter(stageThreeCat, stageThreeCost);
        }
        setBudgetInfoToStorage();
    });

    // END OF PAGELOAD FUNCTION
    // SHOULD BE FIRST --
    // this function reads the BudgetInfo object from local storage

    getBudgetInfoFromStorage();

    /*   USED FOR TESTING - MAY BE NEEDED AGAIN

        budgetInfo.spendingMoney = 5000;
        addBudgetItem("Food", 10);
        addBudgetItem("Savings", 2000);
        addBudgetItem("Other", 300);
        */
    // this may need to be called here - or other places near
    // the end of various functions - for now there are 3 calls
    // interspersed above, testing to finalize
    // setBudgetInfoToStorage();


    // animations

    $(function () {
        var animationend = 'animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd MSanimationEnd';

        $("#submit").on('click', function () {
            $("#prompt").addClass("animated bounceInRight").one(animationend, function () {
                $(this).removeClass("animated bounceInRight");
            });
        });

        $("#submit").on('click', function () {
            $("#output").addClass("animated fadeIn").one(animationend, function () {
                $(this).removeClass("animated fadeIn");
            });
        });

        $("#percentageAllocatorButton").on('click', function () {
            $("#radioButtons").addClass("animated bounceInRight").one(animationend, function () {
                $(this).removeClass("animated bounceInRight");
            });
        });

        $("#submit").on('click', function () {
            $("#additionalInfo").addClass("animated bounceInLeft").one(animationend, function () {
                $(this).removeClass("animated bounceInLeft");
            });
        });
    });

});