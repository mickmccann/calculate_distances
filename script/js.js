    $(function() {
        // add input listeners
        google.maps.event.addDomListener(window, 'load', function () {
            let from_places = new google.maps.places.Autocomplete(document.getElementById('from_places'));
            let to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'));

            google.maps.event.addListener(from_places, 'place_changed', function () {
                let from_place = from_places.getPlace();
                let from_address = from_place.formatted_address;
                $('#origin').val(from_address);
            });

            google.maps.event.addListener(to_places, 'place_changed', function () {
                let to_place = to_places.getPlace();
                let to_address = to_place.formatted_address;
                $('#destination').val(to_address);
            });

        });
        // calculate distance
        function calculateDistance() {
            let origin = $('#origin').val();
            let destination = $('#destination').val();
            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                    // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                    avoidHighways: false,
                    avoidTolls: false
                }, callback);
        }
        // get distance results
        function callback(response, status) {
            if (status != google.maps.DistanceMatrixStatus.OK) {
                $('#result').html(err);
            } else {
                let origin = response.originAddresses[0];
                let destination = response.destinationAddresses[0];
                if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                    $('#result').html("Better get on a plane. There are no roads between "  + origin + " and " + destination);
                } else {
                    let distance = response.rows[0].elements[0].distance;
                    let duration = response.rows[0].elements[0].duration;
                        console.log(response.rows[0].elements[0].distance);
                    let distance_in_kilo = distance.value / 1000; // the kilom
                    let distance_in_mile = distance.value / 1609.34; // the mile
                    let duration_text = duration.text;
                    let duration_value = duration.value;
                    $('#in_mile').text(distance_in_mile.toFixed(2));
                    $('#in_kilo').text(distance_in_kilo.toFixed(2));
                    $('#duration_text').text(duration_text);
                    $('#duration_value').text(duration_value);
                    $('#from').text(origin);
                    $('#to').text(destination);
                }
            }
        }
        // print results on submit the form
        $('#distance_form').submit(function(e){
            e.preventDefault();
            calculateDistance();
        });

    });
