export function host (url) {
    const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const parts = host.split('.').slice(-3);

    if (parts[0] === 'www') {
        parts.shift();
    }

    return parts.join('.')
}

export function timeAgo (time) {
    const between = Date.now() / 1000 - Number(time);

    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    }
    else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    }
    else {
        return pluralize(~~(between / 86400), ' day')
    }
}

/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */
export function format8601(iso) {
    let d = new Date(iso);

    let date = [ d.getMonth() + 1, d.getDate(), d.getFullYear() ];
    let time = [ d.getHours(), d.getMinutes() ];
    let suffix = (time[0] < 12) ? 'AM' : 'PM';
    
    // Convert hour from military time
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
    
    // If hour is 0, set it to 12
    time[0] = time[0] || 12;
    
    // If seconds and minutes are less than 10, add a zero
    for (var i=1; i<3; i++) {
        if (time[i] < 10) {
            time[i] = '0' + time[i];
        }
    }
    
    return `${date.join('/')} ${time.join(':')} ${suffix}`;
}


function pluralize (time, label) {
    if (time === 1) {
        return time + label
    }

    return time + label + 's'
}