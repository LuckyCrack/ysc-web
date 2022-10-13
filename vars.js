var channels_Titles = [];
var channel_Urls = [];
var channel_Ids = [];
var channel_Avatars = [];
var channel_DataJSON = {};
var data_from_file = {};
var limit = 100;
var limit_start = 0;
var limit_end = 20;
var promises = [];
var exclude_list = "";
var use_file = 1;
var percentage = 0
var init_list = [];
var curr_list = [];
var rawData = "";
var called = 0;
var data_saved = {}

var all_ids = []

var num_calls = 0;