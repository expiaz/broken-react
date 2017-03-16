var flux = require('./Flux'),
    f = new flux();

f.setState({
    a: [
        {
            i:1,
            s:"string"
        },
        1,
        "string"
    ],
    o:{
        a:[
            1,
            "string"
        ]
    },
    s:"string",
    i:1
});

console.log('// SET STATE //')

var rep = f.setState({
    a: [
        {
            i:1,
            s:"abc"
        },
        1,
        "string"
    ],
    o:{
        a:[
            1,
            "string"
        ]
    },
    s:"string",
    i:1
}, -1);

console.log(rep);