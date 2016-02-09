	<?php
				$msg = "<VAR>has just recorded blood pressure measurement of systolic<VAR>and diastolic"; // here is msg 

                    $msg = rawurlencode($msg);
                    $userDphone = '7666163366'; // user mobile number
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, "http://pacems.asia:8080/bulksms/bulksms?username=bhd-health&password=1Health1&type=0&dlr=1&destination=91$userDphone&source=ONEHLT&message=$msg");
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    $output = curl_exec($ch);
                    $data['output'] = $output;
                    curl_close($ch);	
	?>