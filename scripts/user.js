var UserUtil = {};

UserUtil.server = "https://datascience.ischool.syr.edu/api/";

UserUtil.currentUser = null;

UserUtil.getUser = function () {
    if (!UserUtil.currentUser) {
        $.ajax({
            type: 'GET',
            async: false,
            url: UserUtil.server + "current_user"
        }).done(function (response) {
            UserUtil.currentUser = JSON.parse(response);
        });
    }
};

UserUtil.getUser();

module.exports = UserUtil;