importScripts('vars.js');
var update_these = {};
onmessage = function(event) {
    data  = event.data;
    getCount(data);
    function getCount(data)
    {
        var rand_array = [];
        var fetches = [];
        for (let i = 0; i < data.length; i++) {
            if(rand_array.includes(i))
            {
                continue;
            }
            else
            {
                if(rand_array.length >= 100)
                {
                    rand_array = [];
                }
            }
            console.log("Rand Array :"+rand_array);
            fetches.push(
            fetch('https://api.socialcounts.org/youtube-live-subscriber-count/'+data[i], {mode: 'cors'})
            .then(res => {return res.json(); })
            .then(res => {
                    setTimeout(() => {
                        rand_array.push(i);
                        update_these = {id: data[i], sub_count: res.est_sub}
                        console.log("GOT ANY");
                        postMessage(update_these);
                    }, 2000);
                }
            )
            .catch(err => {return console.log(err);})
            );
        }
        Promise.all(fetches).then(function() {
            setTimeout(() => {
                console.log("GET ALL");
                getCount(data);
            }, 5000);
        });
    }
};
