/**
 * @author SOSELab@NTOU <albert@ntou.edu.tw>
 */

var lines = [];

$(function() {
    let jsonUrl = "TW-pharmacy.json";
    let maskDataUrl = "https://mask-data.peterli.website";
    intialize();
    getPharmcyData(jsonUrl);
    getMaskData(maskDataUrl);
    setFilterDataBtn();
    setShowAllDataBtn();
});

function intialize() {
    $("#search").attr("disabled", true);
    $("#myInput").val("");
}

function getMaskData(maskDataUrl) {
    $.get(maskDataUrl, function(data) {
        // 醫事機構代碼,醫事機構名稱,醫事機構地址,醫事機構電話,成人口罩總剩餘數,兒童口罩剩餘數,來源資料時間
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        lines = [];

        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {

                var row = [];
                for (var j=0; j<headers.length; j++) {
                    row.push(headers[j]+":"+data[j]);
                }
                lines.push(row);
            }
        }
    });

    return lines;
}

function searchMask(pharmacyId) {
    pharmacyId = pharmacyId.replace(/ /g, "");
    let maskData = [];
    for (let index in lines) {
        lines[index][0] = lines[index][0].replace(/ /g, "");
        if (lines[index][0] === pharmacyId) {
            maskData = lines[index];
            break;
        }
    }

    return maskData;
}

function getPharmcyData(jsonUrl) {
    $.getJSON(jsonUrl, function(data) {
        for (let item in data) {

            if (data[item].closingDate != "") continue;

            let addr = data[item].address ? data[item].address : "住址無資料";
            let tel = data[item].tel ? data[item].tel : "電話無資料";
            let mapURL = data[item].address ? "https://www.google.com/maps?q=" + data[item].name + "+" + data[item].address : "https://www.google.com/maps?q=" + data[item].name;

            let maskData = searchMask(data[item].id);

            let adultMaskNumber = 0;
            let childMaskNumber = 0;
            let updatedTime = '無來源資料時間';

            if (maskData.length !== 0) {
                adultMaskNumber = maskData[4];
                childMaskNumber = maskData[5];
                updatedTime = maskData[6];
            }

            adultMaskNumber = "成人口罩總剩餘數: " + String(adultMaskNumber);
            childMaskNumber = "兒童口罩總剩餘數: " + String(childMaskNumber);
            updatedTime = "來源更新時間: " + updatedTime;

            //Add new card body
            let content = [
                "<div class='card-body'>",
                "<h5 class='card-title' >", data[item].id, ": ", data[item].name + "</h5>",
                "<p>",
                "<h6 class='card-subtitle mb-2 text-muted'>", addr, "</h6>",
                "</p>",
                "<p>",
                "<h6 class='card-subtitle mb-2 text-muted'>", tel, "</h6>",
                "</p>",
                "<p>",
                "<h6 class='card-subtitle mb-2 text-muted mask-info'>", adultMaskNumber, "</h6>",
                "</p>",
                "<p>",
                "<h6 class='card-subtitle mb-2 text-muted mask-info'>", childMaskNumber, "</h6>",
                "</p>",
                "<p>",
                "<h6 class='card-subtitle mb-2 text-muted mask-info'>", updatedTime, "</h6>",
                "</p>",
                "<a href = '", mapURL, "' target='_blank' class='card-link'>地圖連結</a>",
                "<a href = 'http://www.nhi.gov.tw/QueryN/Query3_Detail.aspx?HospID=", data[item].id, "' target='_blank' class='card-link'>中央健保署連結</a>",
                "</div>"
            ].join("");
            $("#list").append(content);
            $("#loading").hide();
            $("#msg").hide();
            $("#search").attr("disabled", false);
        }
    });
}

function setFilterDataBtn() {
    //Filter data based on the user input
    $("#search").on("click", function() {
        let value = $("#myInput").val();
        $("#list div").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
}

function setShowAllDataBtn() {
    $("#all").on("click", function() {
        $("#msg").show();
        $("#myInput").val("");
        $("#search").attr("disabled", true);
        $("#list").hide();
        $("#loading").show("fast", function() {
            $("#list div").filter(function() {
                $(this).toggle(true);
                $("#loading").hide();
                $("#list").show();
                $("#msg").hide();
                $("#search").attr("disabled", false);
            });
        });
    });
}
