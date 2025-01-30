export async function renderSecretsPage() {
  const secretsPage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://kit.fontawesome.com/69b597926c.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <title>User Login</title>
    <style>
        :root {
              --color: black;
              --primary-color: #09639f;
              --header-color: #09639f;
              --background-color: #fff;
              --form-background-color: #f9f9f9;
              --lable-text-color: #333;
              --h2-color: #3b3b3b;
              --border-color: #ddd;
              --input-background-color: white;
              --header-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        body {
            font-family: system-ui;
            background-color: var(--background-color);
            position: relative;
            overflow: hidden;
        }
        body.dark-mode {
            --color: white;
            --primary-color: #09639F;
            --header-color: #3498DB;
            --background-color: #121212;
            --form-background-color: #121212;
            --lable-text-color: #DFDFDF;
            --h2-color: #D5D5D5;
            --border-color: #353535;
            --input-background-color: #252525;
            --header-shadow: 2px 2px 4px rgba(255, 255, 255, 0.25);
        }
        html, body { height: 100%; margin: 0; }
        .container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
        }
        h1 { font-size: 2.5rem; text-align: center; color: var(--header-color); margin: 0 auto 30px; text-shadow: var(--header-shadow); }        
        h2 { text-align: center; color: var(--h2-color) }
        .output-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 15px 0;
            padding: 10px;
            background-color: var(--input-background-color);
            color: var(--lable-text-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            font-family: monospace;
            font-size: 1rem;
            word-wrap: break-word;
        }
        .output { flex: 1; margin-right: 10px; overflow-wrap: break-word; }
        .copy-icon {
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--primary-color);
            transition: color 0.2s;
        }
        .copy-icon:hover { color: #2980b9; }
        .form-container {
            background: var(--form-background-color);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .form-control { margin-bottom: 15px; display: flex; align-items: center; }
        button {
            display: block;
            width: 100%;
            padding: 10px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 5px;
            color: white;
            background-color: var(--primary-color);
            cursor: pointer;
            transition: background-color 0.6s ease;
        }
        .button:hover,
        button:focus {
            background-color: #2980b9;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
        }
        button.button:hover { color: white; }
        .button:active { transform: translateY(2px); box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); }
        @media only screen and (min-width: 768px) {
            .container { width: 30%; }
        }
        .button {
            background: linear-gradient(147deg, transparent 0%, transparent 8%,rgba(9,99,159, 0.45) 8%, rgba(9,99,159, 0.45) 46%,transparent 46%, transparent 100%),
              linear-gradient(107deg, transparent 0%, transparent 21%,rgba(9,99,159, 0.45) 21%, rgba(9,99,159, 0.45) 53%,transparent 53%, transparent 100%),
              linear-gradient(288deg, transparent 0%, transparent 35%,rgba(9,99,159, 0.45) 35%, rgba(9,99,159, 0.45) 91%,transparent 91%, transparent 100%),
              linear-gradient(90deg, rgba(52,152,219, 0.6),rgba(52,152,219, 0.6));
            background-size: 200%;
            color: white;
            font-weight: 600;
            animation: rainbow 20s linear infinite;
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
            animation: rainbow 5s linear infinite;
            }
            @keyframes rainbow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes textclip {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
              }
    </style>
    </head>
    <body>
        <div class="container">
            <h1><i class="fa-sharp fa-solid fa-beat-fade">BPB PANEL 👻 <span style="font-size:14px; position: fixed; right: 0px; margin-top: 43px;">${globalThis.panelVersion}</span></i></h1>
            <div class="form-container">
                <h2>GENERATOR</h2>
            <div>
                <strong>Random uuid</strong>
                <div class="output-container">
                    <span id="uuid" class="output"></span>
                    <span class="copy-icon" onclick="copyToClipboard('uuid')"><i class="fa-solid fa-copy"></i></span>
                </div>
            </div>
            <div>
                <strong>Random trojan password</strong>
                <div class="output-container">
                    <span id="trojan-password" class="output"></span>
                    <span class="copy-icon" onclick="copyToClipboard('trojan-password')"><i class="fa-solid fa-copy"></i></span>
                </div>
            </div>
            <button class="button" onclick="generateCredentials()">Generate Again <i class="fa-solid fa-dice fa-shake"></i> </button>
            </div>
            </div>
            <script>
            localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
            function generateUUID() {
                return crypto.randomUUID();
            }
    
            function generateStrongPassword() {
                const charset =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
                let password = '';
                const randomValues = new Uint8Array(16);
                crypto.getRandomValues(randomValues);
    
                for (let i = 0; i < 16; i++) {
                    password += charset[randomValues[i] % charset.length];
                }
                return password;
            }
    
            function generateCredentials() {
                const uuid = generateUUID();
                const password = generateStrongPassword();
    
                document.getElementById('uuid').textContent = uuid;
                document.getElementById('trojan-password').textContent = password;
            }
    
            function copyToClipboard(elementId) {
                const textToCopy = document.getElementById(elementId).textContent;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert('Copied to clipboard! ✔️'))
                    .catch(err => console.error('Failed to copy text:', err));
            }
    
            generateCredentials();
        </script>
    </body>
    </html>`;

  return new Response(secretsPage, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
