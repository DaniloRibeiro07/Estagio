<?php
	#$fd = dio_open('COM3', O_RDWR);
	#sleep(10);
	#dio_write($fd,"G28");
	#sleep(5);
	#dio_close($fd);
	const portWindows = "COM3";
	exec("MODE portWindows BAUD=9600 PARITY=n DATA=8 XON=on STOP=1");
	$fp = fopen(portWindows, 'r+b');
	fwrite($fp, "G29\n");
	fclose($fp);
?>