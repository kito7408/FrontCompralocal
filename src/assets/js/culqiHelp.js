const privatekey = 'sk_test_f781878eda2badcd';
let culqi_aux = 'start';

const culqi = async() => {
    if (Culqi.token) { // ¡Objeto Token creado exitosamente!
        var token = Culqi.token.id;
        console.log("token", token);

        const data = {
            amount: Culqi.getSettings.amount,
            currency_code: Culqi.getSettings.currency,
            email: Culqi.token.email,
            source_id: Culqi.token.id,
        }

        const response = await fetch('/api/cart/culqi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        });
        
        const myJson = await response.json();

        alert('Se ha registrado el pago correctamente');
        console.log("json",myJson);
        console.log(Culqi);
        culqi_aux = 'next';

    } else {
        console.log(Culqi.error);
        alert(Culqi.error.user_message);
    }
};