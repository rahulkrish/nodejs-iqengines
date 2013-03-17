// test api
var iqengines = require('./lib/iqengines.js');
var assert    = require('assert');
var device_id = (new Date()).toISOString();
var api       = new iqengines.Api();
var testCase  = require('nodeunit').testCase;

module.exports.testEnvironmentSetup = testCase({
    test: function (test) {
        test.ok(process.env.IQE_SECRET, "no IQE_SECRET found in environment");
        test.ok(process.env.IQE_KEY, "no IQE_KEY found in environment");
        test.done();
    }
});

module.exports.testQueryApi = testCase({
    test: function (test) {
        console.log('=> Sending sample query ..');
        qid = api.sendQuery(
            {
                img: './testdata/default.jpg',
                device_id:device_id
            }, 
            function (res) {
                // console.log(res);
                // console.log(qid);
                // console.log(device_id);
                console.log('=> Waiting for results ..');
                test.deepEqual(res, { data: { error: 0 } }, "unexpected data after querying");
                api.waitResults({
                    device_id:device_id
                },
                function (res) {

                    // console.log(JSON.stringify(res));
                    // console.log(res.data.results[0].qid);
                    console.log('=> Received results verifying ..');
                    test.equal(res.data.results[0].qid, qid, "qid from waitResults does not match the qid sent");
                    console.log('=> Retrieving results manuall');
                    api.getResult({qid:qid}, function(res){
                        test.done();
                        // console.log(res);
                    });
                });

            });
            
    }
});

module.exports.testCreateAndGetObject = testCase({
    test: function(test){
        console.log('=> Sending create object request .. ');
        api.createObject(
        {
            name : 'TestsObject' ,
            images : ['./testdata/default.jpg', './testdata/default.jpg'] ,
            meta : { message : 'Test Message'}          

        },function(res){
            console.log('=> Received create obj response verifying .. ');
            test.equal(res.success, 1);                        
            console.log('=> Sending get object request .. ');
            api.getObject(
            {
             obj_id : res.obj_id
            },function(resp){
                console.log('=> Received get response verifying .. ');
                test.equal(resp.error, 0);                
                test.done();
            });
        });
    }
});


module.exports.testCreateAndDeleteObject = testCase({
    test: function(test){
        console.log('=> Sending create object request .. ');
        api.createObject(
        {
            name : 'TestsObject' ,
            images : ['./testdata/default.jpg', './testdata/default.jpg'] ,
            meta : { message : 'Test Message'}          

        },function(res){
            console.log('=> Received create obj response verifying .. ');
            test.equal(res.success, 1);                        
            console.log('=> Sending delete object request .. ');
            api.delObject(
            {
             obj_id : res.obj_id
            },function(resp){
                console.log('=> Received delete response verifying .. ');                
                test.equal(resp.error, 0);                
                test.done();
            });
        });
    }
});

module.exports.testSimpleRequest = testCase({
    test: function(test){
        console.log('=> Testing out simplerequest ..');
        sRequest = require('./lib/simplerequest.js');
        sRequest.test();
        test.done();
    }
});
