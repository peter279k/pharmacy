<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: text/csv;charset=UTF-8');

$url = 'https://data.nhi.gov.tw/resource/mask/maskdata.csv';
$curl = curl_init($url);
$result = curl_exec($curl);
curl_close($curl);
