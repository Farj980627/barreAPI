const { Router } = require('express');
const router = Router();
const conekta = require('conekta');
var cors = require('cors')

//key privada
//key_jgSW20PqPDqXM94NzFEyh4s
// negocio prod key_tmr1Rh6DlvB0Ol3mhTIoAFV

//key publication
//key_LWy1DCYJQ37BYOeJhB52a34
//negocio prod key_KauL34avcvuZq0rzr44B4o5

conekta.api_key = 'key_tmr1Rh6DlvB0Ol3mhTIoAFV';
conekta.locale = 'es';
//Raiz
router.post('/createCustomer', async (req, res) => {
    let customerCreated
    let ordenCreated
    let customer =  conekta.Customer.create({
    name: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone
    }, function(err, response1) {
        if(err){
        return;
        }
        customerCreated = response1.toObject()

       conekta.Order.create({
            "currency": "MXN",
            "customer_info": {
            "customer_id": customerCreated.id,
            "customer_email": customerCreated.email,
            "customer_name": customerCreated.name,
            "customer_phone": customerCreated.phone
            },
            "line_items": [{
                "name": req.body.item,
                "unit_price": req.body.price,
                "quantity": 1
            }],
            "checkout": {
            "type":"HostedPayment",
            "success_url": "http://localhost:8080/after-p",
            "failure_url": "http://localhost:8080/after-p",
            "allowed_payment_methods": ["card"],
            "multifactor_authentication": false,
            "redirection_time": 10 //Tiempo de Redirección al Success/Failure URL, umbrales de 4 a 120 seg.
            },
        }, async function(err, response2) {
            if(err){
                return;
            }            
            ordenCreated = response2.toObject();
            return res.send(ordenCreated.checkout);
        
        });      
        
    });
      
})

router.get('/getOrder/:order', async (req, res, next) => { 
    conekta.Order.find(req.params.order, (err, ord) => {
        return res.send({payment: ord._json.payment_status, amount: ord._json.amount})
    });      
})
 
module.exports = router;