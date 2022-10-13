importScripts("workerFakeDOM.js");
importScripts('jquery-2.1.4.min.js');
// importScripts('rsc/animejs/lib/anime.min.js');
var data;
importScripts('main.js');

onmessage = function(event) {
    data  = event.data;
    getCount(data)   
};

function getCount(data) 
{
    // if(called == 0)
    // {
    //     sortDivs();
    //     called == 1
    // }

    // var sliced = Object.fromEntries(
    //     Object.entries(data).slice(limit_start, limit_end)
    // )
    // console.log(sliced);
    // const ARRAY_LENGTH = 10
    // const randomArray = []
    // for(let i = 0; i<ARRAY_LENGTH; i++) {randomArray.push(Math.ceil(getRandomArbitrary(1,100)))}
    jQuery.each(data, function (indexInArray, dataItem) {
        var titleX = String(dataItem.title);
        titleX = titleX.toLowerCase();
        if(!(exclude_list.includes(titleX)))
        {
            jQuery.ajax({
                type: "GET",
                url: "https://api.socialcounts.org/youtube-live-subscriber-count/"+dataItem.id,
                crossDomain: true,
                success: function (response) {
                    data_saved[indexInArray] = {id: dataItem.id, sub_count: response.est_sub};
                    // console.log(data_saved);
                    var id_selector = '#'+dataItem.id+'_subcount';
                    var id_s = '#'+dataItem.id;
                    var current_val = parseInt(jQuery(id_s).attr('data-sort'));
                    curr_list.push(response.est_sub);
                    if(current_val != response.est_sub)
                    {
                        if(current_val < response.est_sub)
                        {
                        }
                        else
                        {
                        }
                        setTimeout(() => {
                            // postMessage({ update: 'data',id_selector: id_selector,id_s: id_s,sub_count_t: response.est_sub});
                            // updateUIData(id_selector,id_s,response.est_sub)
                            // jQuery(id_selector).html(response.est_sub);
                            // jQuery(id_s).attr('data-sort',response.est_sub);
                            // console.log("Value : "+response.est_sub);
                        }, 5500);
                    }
                    // setTimeout(() => {
                    //     promises.push("sent")
                    // }, 2500);
                    // sortDivs();
                },
                error: function (error) {
                    promises.push("sent")
                }
            });
        }
    });
    jQuery.when.apply(jQuery, promises).then(function() {
        setTimeout(function () {
            promises = [];
            curr_list.sort();
            curr_list.reverse();
            if(JSON.stringify(init_list)==JSON.stringify(curr_list))
            {
                updateSort();
            }
            getCount(data);
        }, 5000);
    });
}

