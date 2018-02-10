$(function() {

    var $callLogTable = $('#callLogTable');
    const ICON_PATH = "assets/icon/";
    const EMPTY_STRING = "";
    const SUSPECTED_SPAM_STRING = "Suspected Spam";
    const POTENTIAL_FRAUD_STRING = "Potential Fruad"; //Data has typo here
    const FLAGGED_STRING = "flagged";
    const BLOCKED_STRING = "blocked";
    const INCOMING_STRING = "Incoming";
    const OUTGOING_STRING = "Outgoing";
    const MISS_STRING = "NoAnswer";
    const IDENTIFIED_BY_HIYA_STRING = "Identified by Hiya";
    const FLAGGED_BY_HIYA_STRING = "Flagged by Hiya";


    const IDENTIFIED_PROFILE_PHOTO = "avatar-identified-40.png";
    const SUSPECTED_SPAM_PROFILE_PHOTO = "avatar-spam-40.png";
    const POTENTIAL_FRAUD_PROFILE_PHOTO = "avatar-premium-rate-40.png";
    const UNKNOWN_PROFILE_PHOTO = "avatar-unknown-40.png";
    const OUTGOING_ICON = "micro-ic-outgoing.png";
    const INCOMING_ICON_HIT = "micro-ic-incoming.png";
    const INCOMING_ICON_MISS = "micro-ic-missed.png";

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/call_log',
        success: function(calls) {

            calls.sort(function(a, b) {
                return a.utcTimestamp > b.utcTimestamp ? -1 : a.utcTimestamp < b.utcTimestamp ? 1 : 0;
            });

            var prevDay = null;

            $.each(calls, function(i, call) {
                var today = moment(call.utcTimestamp).calendar(null,{
                    lastDay : '[Yesterday]',
                    sameDay : '[Today]',
                    nextDay : '[Tomorrow]',
                    lastWeek : '[last] dddd',
                    nextWeek : 'dddd',
                    sameElse : 'MMMM Do YYYY'
                });
                //Check if it is a different day
                if (prevDay == null || prevDay != today) {
                    $callLogTable.append(
                        '<tr>'
                            + '<td class="grey font_size_big" colspan="3">' + today + '</td>'
                        + '</tr>');
                    prevDay = today;
                }            
                //Draw table by fetch call log line by line 
                $callLogTable.append(
                    '<tr class="callLogTable_row">'
                        + '<td>'
                            + '<div class="container">'
                                + getProfilePhoto(call.reputation, call.identity)
                                + getProfileText(call.reputation, call.identity)
                            + '</div>'
                        + '</td>' 
                        + '<td>'
                            + '<div class="block_inline left font_size_big">' + getIdentity(call.identity, formatPhone(call.phone)) + '</div>'
                            + '<div class="block_inline right grey font_thin font_size_small">' + getPhone(call.identity, formatPhone(call.phone)) + '</div>'
                        + '</td>'
                        + '<td>' 
                            + '<div class="block_inline left icon_and_time_block">'
                                + '<div class="icon_block">' + getDetailPhoto(call.termination, call.callDirection) + '</div>'
                                + '<div class="time_block grey font_thin font_size_small">' + moment(call.utcTimestamp).format('h:mm a') + '</div>'
                            + '</div>'
                            + '<div class="block_inline right grey font_thin font_size_small">'
                                + getAdditionalInfo(call.reputation, call.identity)
                            + '</div>'
                        + '<td>' 
                    + '</tr>');
            });
        }
    });
    /**
     * This method is used to format phone number from raw phone data.
     * @param {phone number} phone 
     */
    function formatPhone(phone) {
        return phone.substring(2, 5) + '.' + phone.substring(5, 8) + '.' + phone.substring(8, 12);
    }

    /**
     * This method is used to check if identity needs to be replaced by phone number.
     * @param {identity} identity 
     * @param {phone} phone 
     */
    function getIdentity(identity, phone) {
        if (identity == null) {
            return phone;
        }
        return identity;
    }

    /**
     * This method is used to check if phone number needs to be blank out.
     * @param {identity} identity 
     * @param {identity} phone 
     */
    function getPhone(identity, phone) {
        if (identity == null) {
            return "";
        }
        return phone;
    }

    /**
     * This method is used to get profile photo.
     * @param {reputation} reputation 
     * @param {identity} identity 
     */
    function getProfilePhoto(reputation, identity) {
        var profilePhoto = EMPTY_STRING;
        if (reputation == null) {
            if (identity == null) {
                profilePhoto = UNKNOWN_PROFILE_PHOTO;
            } else {
                profilePhoto = IDENTIFIED_PROFILE_PHOTO;
            }
        } else if (reputation == FLAGGED_STRING) {
            profilePhoto = SUSPECTED_SPAM_PROFILE_PHOTO;
        } if (reputation == BLOCKED_STRING) {
            profilePhoto = POTENTIAL_FRAUD_PROFILE_PHOTO;
        }
        return '<img class="profile_photo" src="' + ICON_PATH + profilePhoto + '">'; 
    }

    /**
     * This method is used to get text on profile photo.
     * @param {reputation} reputation 
     * @param {identity} identity 
     */
    function getProfileText(reputation, identity) {
        var profileText = EMPTY_STRING;
        
        if (reputation == null) {
            if (identity == null) {
                profileText = EMPTY_STRING;
            } else {
                profileText = getName(identity);
            }
        } else if (reputation == FLAGGED_STRING) {
            profileText = EMPTY_STRING;
        } if (reputation == BLOCKED_STRING) {
            profileText = EMPTY_STRING;
        }
        return '<div class="text_centered">' + profileText + '</div>';
    }

    /**
     * This method is used to return initial.
     * @param {identity} identity 
     */
    function getName(identity) {
        strings = identity.split(" ");
        /*
        assume only two categories:
            name -> string.length == 2
            notes -> string.length != 3 (include senerios like e.x. "Dad", "Dad Office Number")
        */
        if (strings.length == 2) {
            return strings[0].charAt(0).toUpperCase() + strings[1].charAt(0).toUpperCase();
        } else {
            return strings[0].charAt(0).toUpperCase();
        }
    }

    /**
     * This method is used to get call detail icon.
     * @param {termination} termination 
     * @param {callDirection} callDirection 
     */
    function getDetailPhoto(termination, callDirection) {
        var detailIcon = EMPTY_STRING;
        if (callDirection == "Outgoing") {
            detailIcon = OUTGOING_ICON;
        } else {
            if (termination == MISS_STRING) {
                detailIcon = INCOMING_ICON_MISS;
            } else {
                detailIcon = INCOMING_ICON_HIT;
            }
        }
        return '<img class="detail_icon" src="' + ICON_PATH + detailIcon + '">';    
    }

    /**
     * This method is used to get Hiya info.
     * @param {reputation} reputation 
     * @param {identity} identity 
     */
    function getAdditionalInfo(reputation, identity) {
        var additionalInfo = EMPTY_STRING;
        if (reputation == null) {
            if (identity == null) {
                additionalInfo = EMPTY_STRING;
            } else {
                additionalInfo = IDENTIFIED_BY_HIYA_STRING;
            }
        } else if (reputation == FLAGGED_STRING) {
            additionalInfo = FLAGGED_BY_HIYA_STRING;
        } if (reputation == BLOCKED_STRING) {
            additionalInfo = FLAGGED_BY_HIYA_STRING;
        }
        return additionalInfo;
    }

});