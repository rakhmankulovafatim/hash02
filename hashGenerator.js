document.getElementById('leftForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const secretKey = document.getElementById('secretKeyInput').value;
    const publicKey = document.getElementById('publicKeyInputLeft').value;
    const message = document.getElementById('messageInputLeft').value;

    
    const hash = await generateHash(message);

   
    const encryptedSecretKey = await encryptPublicKey(secretKey); 
    
    const encryptedPublicKey = await encryptPublicKey(publicKey);

   
    document.getElementById('receivedSecretKeyLeft').textContent = encryptedSecretKey;
    document.getElementById('receivedPublicKeyLeft').textContent = encryptedPublicKey;
    document.getElementById('receivedMessageLeft').textContent = message;
});

document.getElementById('rightForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const publicKey = document.getElementById('publicKeyInputRight').value;
    const message = document.getElementById('messageInputRight').value;

 
    const encryptedPublicKey = await encryptPublicKey(publicKey);

    document.getElementById('receivedPublicKeyRight').textContent = encryptedPublicKey;
    document.getElementById('receivedMessageRight').textContent = message;
});

async function generateHash(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function encryptPublicKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);

    
    const aesKey = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt"]
    );

    
    const iv = crypto.getRandomValues(new Uint8Array(12));


    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        aesKey,
        data
    );

    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);


    return btoa(String.fromCharCode(...combined));
}
