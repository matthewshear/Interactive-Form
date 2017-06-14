$(document).ready( function() {

	// declare some basic variables
	var jsPunsColors = [ 'cornflowerblue', 'darkslategrey', 'gold' ];
	var heartJsColors = [ 'tomato', 'steelblue', 'dimgrey' ];
	var timesAvailable = [ 'Tuesday 9am-12pm', 'Tuesday 1pm-4pm', 'Wednesday 9am-12pm', 'Wednesday 1pm-4pm' ];
	var timesUsed = [ ];
	var clickedText = ''; 
	var clickedTime = '';
	var currentText = '';
	var isChecked = false;
	var totalCheckedPrice = 0;
	var start_pos = 0;
	var end_pos = 0;
	var	atLeastOneBoxChecked = false;
	var cc_result = false;

	// add a remove method for arrays
	Array.prototype.remove= function() {
	    var what, a= arguments, L= a.length, ax;
	    while(L && this.length){
	        what= a[--L];
	        while((ax= this.indexOf(what))!= -1){
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	};

	// function validates an email address with a regular expression
	function isEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}

	// display correct color selections in select list
	function displayCorrectColors() {

		var colorArray = [];

		// if valus is 'js puns' use first color array
		if ( $("#design").val() === 'retro' ) {
			// set array to js puns color array
			colorArray = jsPunsColors;
		// if valus is 'heart js' use second color array
		} else if ( $("#design").val() === 'modern' ) {
			// set array to heart js color array
			colorArray = heartJsColors;
		}

		// display appropriate select box based on the selected design
		if ( $("#design").val().length === 0 ) {
			$("#colors-js-puns").hide();
		} else {
			$("#colors-js-puns").show();
		}

		// show all colors in the array and hide all colors not in the array
		for( var i = 0; i < $("#color option").length; i++ ) {
			// if colorArray exists AND current color is in array AND index is not 0 (the first option)
			if ( colorArray && ( colorArray.indexOf( $("#color option")[i].value ) !== -1 || i === 0 ) ) {
				$("#color option")[i].style.display = 'block';
			} else {
				$("#color option")[i].style.display = 'none';
			}
		}

	}

	// focus on first input field
	$('input[type="text"]:first').focus();

	// run function to display colors (this should hide all colors)
	displayCorrectColors();

	// hide other title field if JavaScript is on
	$("#other-title").hide();

	$("#select-payment-method").show();
	$("#credit-card").hide();	
	$("#paypal").hide();
	$("#bitcoin").hide();

	// display total cost of checkboxes if JavaScript is on
	$("#total").html("Total Cost: $0");

	// hide color choices if JavaScript is on
	$("#colors-js-puns").hide();

	// run when job title selection is changed
	$('#title').change( function() {

		// if job title is other
		if ( $(this).val() === 'other' ) {
			// show other job title field
			$("#other-title").show();
			// focus on other job title field
			$("#other-title").focus();
		} else {
			// hide other job title field
			$("#other-title").hide();
		}

	});

	// run when job title selection is changed
	$('#design').change( function() {

		// display the correct color selections
		displayCorrectColors();

		// select first option "Select color.."
		$("#color").val("");

	});

	// run when checkbox is clicked
	$("input[type='checkbox']").click( function() {

		console.clear();

		// get the value of checked.. true or false
		isChecked = this.checked;

		// get the text around the checkbox
		clickedText = $(this).parent().text();

		// get the clicked time from the clicked text
		start_pos = clickedText.indexOf('— ') + 1;
		end_pos = clickedText.indexOf(', $',start_pos);
		clickedTime = clickedText.substring(start_pos,end_pos);

		// get the clicked time from the clicked text
		start_pos = clickedText.indexOf('$') + 1;
		end_pos = start_pos + 5;
		clickedPrice = parseFloat( clickedText.substring(start_pos,end_pos) );

		// if checkbox is clicked add to price
		if ( isChecked ) {
			totalCheckedPrice += clickedPrice;
		// otherwise subtract from price
		} else {
			totalCheckedPrice -= clickedPrice;
		}

		// loop through checkboxes and disable or enable checkboxes with this time
		$("input[type='checkbox']").each( function() {

			// get the text around the current checkbox
			currentText = $(this).parent().text();

			// get the current time from the current checkbox text
			start_pos = currentText.indexOf('— ') + 1;
			end_pos = currentText.indexOf(', $',start_pos);
			currentTime = currentText.substring(start_pos,end_pos);

			// if the current checkbox is not the clicked checkbox
			if ( currentText !== clickedText && currentTime === clickedTime ) {
				if ( isChecked ) {
					$(this).attr('disabled', true);	
				} else {
					$(this).attr('disabled', false);	
				}
			}

		});

		totalStr = "Total Cost: $" + totalCheckedPrice;

		$("#total").html(totalStr);

	});

	// if payment type is changed then display appropriate boxes
	$("#payment").change( function() {
		var section = $(this).val();

		if ( section === 'credit card' ) {
			$("#select-payment-method").hide();
			$("#credit-card").show();
			$("#paypal").hide();
			$("#bitcoin").hide();
		} else if ( section === 'paypal' ) {
			$("#select-payment-method").hide();
			$("#credit-card").hide();
			$("#paypal").show();
			$("#bitcoin").hide();
		} else if ( section === 'bitcoin' ) {
			$("#select-payment-method").hide();
			$("#credit-card").hide();
			$("#paypal").hide();
			$("#bitcoin").show();
		} else {
			$("#select-payment-method").show();
			$("#credit-card").hide();
			$("#paypal").hide();
			$("#bitcoin").hide();
		}

	});

	// on button click check for errors
	$("button").click( function() {

		var errorMsg = '';

		if ( $("#name").val().length === 0 ) {
			errorMsg += '<li>Please enter your name.</li>';
		}

		if ( $("#mail").val().length || !isEmail($("#mail").val()) ) {
			errorMsg += '<li>Please enter a valid email address.</li>';
		}


		// loop through checkboxes and disable or enable checkboxes with this time
		$("input[type='checkbox']").each( function() {
			if ( $(this).checked ) {
				atLeastOneBoxChecked = true;
			}
		});

		if ( totalCheckedPrice === 0 ) {
			errorMsg += '<li>Please check at least one box under &quot;Register for Actitivities&quot;.</li>';
		}

		if ( $("#payment").val() === 'credit card' ) {

			cc_result = Validate( $("#cc-num").val() );

			if ( !cc_result ) {
				errorMsg += '<li>Please enter a valid credit card number.</li>';
			}

			if ( $("#zip").val().length !== 5 && $("#name").val().length !== 10 ) {
				errorMsg += '<li>Please enter a valid zip code.</li>';
			}

			if ( $("#cvv").val().length !== 3 ) {
				errorMsg += '<li>Please enter a valid CVV code.</li>';
			}

		}

		if ( errorMsg.length > 0 ) {
			errorMsg = "Errors found:<ul>" + errorMsg;			
		}

		if ( errorMsg.length > 0 ) {
			errorMsg += "</ul>";
			$("#error-msg").html(errorMsg);
			$("#error-msg").show(500);
		}

		return false;

	});

});