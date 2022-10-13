jQuery(document).ready(function () {
    var video_id = VID;
    video_id = video_id.split("?v=");
    video_id = video_id[1];
    $(document).on("keypress", function (e) {
        // use e.which
        if(e.which == 114)
        {
            $.ajax({
                type: "GET",
                url: "https://www.googleapis.com/youtube/v3/videos?part=statistics,liveStreamingDetails&id="+video_id+"&key=AIzaSyAtke5khyeblAjYWxAvcTvrzjEFfEx1I4U",
                success: function (response) {
                    // console.log(response);
                    var views = response.items[0].liveStreamingDetails.concurrentViewers;
                    var likes = response.items[0].statistics.likeCount;
                    $('#watch_text').html(views);
                    $('#like_text').html(likes);
                },
                error: function (error) {
                    console.log(error)
                }
            });
        }
    });
    var watch_text = "#watch_text";
    var watch_text_el = document.querySelector(watch_text);
    var like_text = "#like_text";
    var like_text_el = document.querySelector(like_text);
    new Odometer({
        el: watch_text_el,
        value: 0,
        duration: 1500,
        format: '(,ddd)',
    }); 
    new Odometer({
        el: like_text_el,
        duration: 1500,
        value: 0,
        format: '(,ddd)',
    }); 
    Swal.fire({
        title: 'Loading...',
        timerProgressBar: true,
        timer: 30000,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
            var data_saved_p =  CONFIG;
            jQuery('#excludeinput').val(data_saved_p.exc_list);
            jQuery('#exampleModalSm').fadeIn('100');
            limit = 100;
            exclude_list = CONFIG.exc_list;
            var exclude_list_str = exclude_list;
            exclude_list = exclude_list.toLowerCase()
            if(jQuery.isNumeric(limit))
            {
                if(limit > 100)
                {
                    limit = 100
                }
                else
                {
                    if(limit < 1)
                    {
                        limit = 1
                    }
                }
            }
            else
            {
                limit = 100
            } 
            limit += 1;
            if(!(isEmptyOrSpaces(exclude_list)))
            {
                exclude_list = exclude_list.split(',');
            }
            jQuery('#exampleModalSm').fadeOut('200');
            if(!(jQuery('#flexSwitchCheckDefault').is(":checked")))
            {
                jQuery('#example2ModalSm').show();
            }
            CONFIG = {exc_list: exclude_list_str}
            getChannels();
        },
        willClose: () => {
            $.ajax({
                type: "GET",
                url: "https://www.googleapis.com/youtube/v3/videos?part=statistics,liveStreamingDetails&id="+video_id+"&key=AIzaSyAtke5khyeblAjYWxAvcTvrzjEFfEx1I4U",
                success: function (response) {
                    // console.log(response);
                    var views = response.items[0].liveStreamingDetails.concurrentViewers;
                    var likes = response.items[0].statistics.likeCount;
                    $('#watch_text').html(views);
                    $('#like_text').html(likes);
                },
                error: function (error) {
                    console.log(error)
                }
            });
            $('#channelsList2 .channelCard:first-child').addClass('animatedEl');
            var animation = anime({
                targets: '#channelsList2 .channelCard:first-child',
                easing: 'linear',
                // keyframes: [
                //     {
                //         marginTop: '0px',
                //         scale: 1
                //     },
                //     {
                //         marginTop: '-86px',
                //         scale: 0
                //     }
                // ],
                loop: true,
                duration: 4400,
                loopComplete: function(anim) {
                    $("#channelsList2 .channelCard:first-child").clone().insertAfter("#channelsList2 .channelCard:last-child");
                    $("#channelsList2 .channelCard:first-child").remove();
                    $("#channelsList2 .channelCard").removeClass('animatedEl');
                    $("#channelsList2 .channelCard:first-child").addClass('animatedEl');
                    var n_id = $('#channelsList2 .channelCard:last-child').attr('id');
                    var selector3 = "#"+n_id+"_subcount";
                }
            });
        }
    });
});

function getChannels() {
    channel_DataJSON =  CHANNELS_DATA;
    renderChannel(channel_DataJSON);
}
function renderChannel(data)
{
    var count = 1;
    var set = 51;
    jQuery.each(data, function (indexInArray, dataItem) {
        if(indexInArray == limit)
        {
            return false;
        }
        if((dataItem.title).length>20)
        {
            var trimmed_title = (dataItem.title).substring(0, 20)+"...";
        }
        else
        {
            var trimmed_title = (dataItem.title);
        }
        
        var titleZ = String(dataItem.title);
        titleZ = titleZ.toLowerCase()
        if(!(exclude_list.includes(titleZ)))
        {
            all_ids.push(dataItem.id);
            if(count<set)
            {
                var channelDiv = '<div data-sort="0" class="channelCard" id="'+dataItem.id+'"><div class="count_holder">--</div><img class="thumbnail" src="'+dataItem.avatar+'" alt=""><div class="data_holder"><div class="channel_title">'+trimmed_title+'</div><div class="subcount" id="'+dataItem.id+'_subcount">000,000,000</div></div></div>'; 
                jQuery('#channelsList').append(channelDiv);
                var selector_id = "#"+dataItem.id+"_subcount";
            }
            else
            {
                var channelDiv = '<div data-sort="0" class="channelCard" id="'+dataItem.id+'"><div class="count_holder">--</div><img class="thumbnail" src="'+dataItem.avatar+'" alt=""><div class="data_holder"><div class="channel_title">'+trimmed_title+'</div><div class="subcount" id="'+dataItem.id+'_subcount">000,000,000</div></div></div>'; 
                jQuery('#channelsList2').append(channelDiv);
                var selector_id = "#"+dataItem.id+"_subcount";
            }
            fetchSubsInit(dataItem.id,selector_id);
        }
        else
        {
            limit++;
            set++;
        }
        count++;
    });
    // getCount(data);
    var worker = new Worker("worker.js");
    worker.onmessage = receivedWorkerMessage;

    worker.postMessage(all_ids);
    // UpdateData();
}
var fetchSubsCounter = 0;
async function fetchSubsInit(id,selector) {
    const response = await fetch("https://api.socialcounts.org/youtube-live-subscriber-count/"+id);
    // console.log(response.status);
    const result_subs = await response.json();
    var intval = result_subs.est_sub;
    var selector2 = "#"+id;
    jQuery(selector2).attr('data-sort',intval);
    var el = document.querySelector(selector);
    init_list.push(intval); 
    new Odometer({
        el: el,
        duration: 1000,
        value: intval,
        format: '(,ddd)',
    }); 
    fetchSubsCounter++;
    if(fetchSubsCounter >= 99)
    {
        sortDivs();
    }
}
// function getCount(data) 
// {
//     // if(called == 0)
//     // {
//     //     sortDivs();
//     //     called == 1
//     // }

//     // var sliced = Object.fromEntries(
//     //     Object.entries(data).slice(limit_start, limit_end)
//     // )
//     // console.log(sliced);
//     const ARRAY_LENGTH = 10
//     const randomArray = []
//     for(let i = 0; i<ARRAY_LENGTH; i++) {randomArray.push(Math.ceil(getRandomArbitrary(1,100)))}
//     jQuery.each(randomArray, function (indexInArray, dataItem) {
//         var titleX = String(data[dataItem].title);
//         titleX = titleX.toLowerCase();
//         if(!(exclude_list.includes(titleX)))
//         {
//             jQuery.ajax({
//                 type: "GET",
//                 url: "https://api.socialcounts.org/youtube-live-subscriber-count/"+data[dataItem].id,
//                 success: function (response) {
//                     var id_selector = '#'+data[dataItem].id+'_subcount';
//                     var id_s = '#'+data[dataItem].id;
//                     var current_val = parseInt(jQuery(id_s).attr('data-sort'));
//                     curr_list.push(response.est_sub);
//                     if(current_val != response.est_sub)
//                     {
//                         if(current_val < response.est_sub)
//                         {
//                             anime({
//                             targets: id_selector,
//                             keyframes: [
//                                 {color: '#000'},
//                                 {color: '#10D100'},
//                                 {color: '#10D100'},
//                                 {color: '#10D100'},
//                                 {color: '#10D100'},
//                                 {color: '#10D100'},
//                                 {color: '#000'},
//                             ],
//                             duration: 1800,
//                             easing: 'linear',
//                             loop: false
//                             });
//                         }
//                         else
//                         {
//                             anime({
//                             targets: id_selector,
//                             keyframes: [
//                                 {color: '#000'},
//                                 {color: '#FF003D'},
//                                 {color: '#FF003D'},
//                                 {color: '#FF003D'},
//                                 {color: '#FF003D'},
//                                 {color: '#FF003D'},
//                                 {color: '#000'},
//                             ],
//                             duration: 1800,
//                             easing: 'linear',
//                             loop: false
//                             });
//                         }
//                         anime({
//                             targets: id_s,
//                             keyframes: [
//                                 {backgroundColor: '#fff'},
//                                 {backgroundColor: '#d5d5d5'},
//                                 {backgroundColor: '#fff'}
//                             ],
//                             duration: 1000,
//                             easing: 'linear',
//                             loop: false
//                         })
//                         setTimeout(() => {
//                             jQuery(id_selector).html(response.est_sub);
//                             jQuery(id_s).attr('data-sort',response.est_sub);
//                         }, 400);
//                     }
//                     // setTimeout(() => {
//                     //     promises.push("sent")
//                     // }, 2500);
//                     // sortDivs();
//                 },
//                 error: function (error) {
//                     promises.push("sent")
//                 }
//             });
//         }
//     });
//     jQuery.when.apply(jQuery, promises).then(function() {
//         setTimeout(function () {
//             promises = [];
//             curr_list.sort();
//             curr_list.reverse();
//             if(JSON.stringify(init_list)==JSON.stringify(curr_list))
//             {
//                 sortDivs();
//             }
//             if(limit_end>=100)
//             {
//                 limit_start = 0;
//                 limit_end = 20;
//             }
//             else
//             {
//                 limit_start = limit_end;
//                 limit_end = limit_end + 20;
//             }
//             getCount(data);
//         }, 2000);
//     });
// }
function sortdata(data = [], asc = true) {
  const result = [...data];
  const sign = asc ? 1 : -1;
  result.sort((a, b) => (a.subcount - b.subcount) * sign);
  return JSON.stringify(result);
}
function sortDivs()
{
    var result = jQuery('#channelsList .channelCard').sort(function (a, b) {
        var contentA =parseInt( jQuery(a).data('sort'));
        var contentB =parseInt( jQuery(b).data('sort'));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });
    jQuery('#channelsList').html(result);
    init_list.sort();
    init_list.reverse();
    var lenth_card = jQuery('#channelsList .channelCard').length;
    for (let inss = 0; inss < lenth_card; inss++) {
        jQuery('#channelsList .channelCard').eq(inss).find('.count_holder').html(inss+1);
    }

    var result = jQuery('#channelsList2 .channelCard').sort(function (a, b) {
        var contentA =parseInt( jQuery(a).data('sort'));
        var contentB =parseInt( jQuery(b).data('sort'));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });
    jQuery('#channelsList2').html(result);
    init_list.sort();
    init_list.reverse();
    var lenth_card = jQuery('#channelsList2 .channelCard').length;
    for (let inss = 0; inss < lenth_card; inss++) {
        jQuery('#channelsList2 .channelCard').eq(inss).find('.count_holder').html((inss+1)+50);
    }
}
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function receivedWorkerMessage(event)
{
    if(num_calls >= 10)
    {
        await resolveAfter5Seconds();
        num_calls = 0;
        return false;
    }
    num_calls++;
    var updation = event.data;
    var id_selector = '#'+updation.id+'_subcount';
    var id_s = '#'+updation.id;
    var sub_scount = updation.sub_count;
    // document.getElementById(id_s).setAttribute('data-sort',sub_scount);
    // jQuery(id_selector).html(sub_scount);
    var current_val = parseInt(jQuery(id_s).attr('data-sort'));
    if(current_val != sub_scount)
    {
        // anime({
        //     targets: id_s,
        //     keyframes: [
        //         {backgroundColor: '#fff'},
        //         {backgroundColor: '#d5d5d5'},
        //         {backgroundColor: '#fff'}
        //     ],
        //     duration: 1000,
        //     easing: 'linear',
        //     loop: false
        // })
        gsap.fromTo(id_s, {backgroundColor: '#d5d5d5'},{backgroundColor: "#fff", duration: 0.8});
        if(current_val < sub_scount)
        {
            gsap.to(id_selector,{
                keyframes: {
                    "0%": {color: "#000"},
                    "25%":{color: '#10D100'},
                    "50%":{color: '#10D100'},
                    "75%":{color: '#10D100'},
                    "100%":{color: "#000"}
                },
                duration: 2.2
            });
            // anime({
            //     targets: id_selector,
            //         keyframes: [
            //             {color: '#000'},
            //             {color: '#10D100'},
            //             {color: '#10D100'},
            //             {color: '#10D100'},
            //             {color: '#10D100'},
            //             {color: '#10D100'},
            //             {color: '#000'},
            //         ],
            //         duration: 1800,
            //         easing: 'linear',
            //         loop: false
            //     });
            }
            else
            {
                gsap.to(id_selector,{
                    keyframes: {
                        "0%": {color: "#000"},
                        "25%":{color: '#FF003D'},
                        "50%":{color: '#FF003D'},
                        "75%":{color: '#FF003D'},
                        "100%":{color: "#000"}
                    },
                    duration: 2.2
                });
                // anime({
                //     targets: id_selector,
                //     keyframes: [
                //         {color: '#000'},
                //         {color: '#FF003D'},
                //         {color: '#FF003D'},
                //         {color: '#FF003D'},
                //         {color: '#FF003D'},
                //         {color: '#FF003D'},
                //         {color: '#000'},
                //     ],
                //     duration: 1800,
                //     easing: 'linear',
                //     loop: false
                // });
            }
            
            jQuery(id_selector).html(sub_scount);
            jQuery(id_s).attr('data-sort',sub_scount);
    }
    // myCounter.numberAnimate('set', w_commInt);

}

function resolveAfter5Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 5000);
  });
}
