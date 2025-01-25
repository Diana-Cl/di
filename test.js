import { connect } from 'cloudflare:sockets';
// How to generate your own UUID:
// https://www.uuidgenerator.net/
let userID = '89b3cbba-e6ac-485a-9481-976a0415eab9';

//Find proxyIP : https://github.com/NiREvil/vless/blob/main/sub/ProxyIP.md
//Find proxyIP : https://www.nslookup.io/domains/ipdb.rr.nu/dns-records/
const proxyIPs= ['bpb.radically.pro']; // OR use ['bpb.radically.pro', 'turk.radicalization.ir', 'bpb.yousef.isegaro.com', 'proxyip.digitalocean.hw.090227.xyz'];
const defaultHttpPorts = ['80', '8080', '2052', '2082', '2086', '2095', '8880'];
const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
let proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
let dohURL = 'https://cloudflare-dns.com/dns-query';
let trojanPassword = `REvil`;
// https://emn178.github.io/online-tools/sha224.html
// https://www.atatus.com/tools/sha224-to-hash
let hashPassword = '6dfd0e8e67ad3230498f80938cb924bc767b7db65eb4c9545fbe4ad7';
let panelVersion = 'V2.6';

if (!isValidUUID(userID)) throw new Error(`Invalid UUID: ${userID}`);
if (!isValidSHA224(hashPassword)) throw new Error(`Invalid Hash password: ${hashPassword}`);

export default {
    /**
     * @param {import("@cloudflare/workers-types").Request} request
     * @param {{UUID: string, PROXYIP: string, DNS_RESOLVER_URL: string}} env
     * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
     * @returns {Promise<Response>}
     */
    async fetch(request, env, ctx) {
        try {          
            userID = env.UUID || userID;
            proxyIP = env.PROXYIP || proxyIP;
            dohURL = env.DNS_RESOLVER_URL || dohURL;
            trojanPassword = env.TROJAN_PASS || trojanPassword;
            hashPassword = env.HASH_PASS || hashPassword;
            const upgradeHeader = request.headers.get('Upgrade');
            const url = new URL(request.url);
            
            if (!upgradeHeader || upgradeHeader !== 'websocket') {
                
                const searchParams = new URLSearchParams(url.search);
                const host = request.headers.get('Host');
                const client = searchParams.get('app');

                switch (url.pathname) {

                    case '/cf':
                        return new Response(JSON.stringify(request.cf, null, 4), {
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            },
                        });
                        
                    case '/warp-keys':

                        const Auth = await Authenticate(request, env); 
                        if (!Auth) return new Response('Unauthorized', { status: 401 });

                        if (request.method === 'POST' && request.headers.get('content-type') === 'application/json') {
                            try {
                                const warpKeys = await request.json();
                                const warpPlusError = await fetchWgConfig(env, warpKeys);
                                if (warpPlusError) {
                                    return new Response(warpPlusError, { status: 400 });
                                } else {
                                    return new Response('Warp configs updated successfully', { status: 200 });
                                }
                            } catch (error) {
                                console.log(error);
                                return new Response(`An error occurred while updating Warp configs! - ${error}`, { status: 500 });
                            }

                        } else {
                            return new Response('Unsupported request', { status: 405 });
                        }

                    case `/sub/${userID}`:

                        if (client === 'sfa') {
                            const BestPingSFA = await getSingboxConfig(env, host, client, false);
                            return new Response(JSON.stringify(BestPingSFA, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'clash') {
                            const BestPingClash = await getClashConfig(env, host, false);
                            return new Response(JSON.stringify(BestPingClash, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }

                        const normalConfigs = await getNormalConfigs(env, host, client);
                        return new Response(normalConfigs, { 
                            status: 200,
                            headers: {
                                'Content-Type': 'text/plain;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });                        

                    case `/fragsub/${userID}`:
  
                        let fragConfigs = client === 'hiddify'
                            ? await getSingboxConfig(env, host, client, false, true)
                            : (await getFragmentConfigs(env, host));

                        return new Response(JSON.stringify(fragConfigs, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });

                    case `/warpsub/${userID}`:

                        if (client === 'clash') {
                            const clashWarpConfigs = await getClashConfig(env, host, true);
                            return new Response(JSON.stringify(clashWarpConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }
                        
                        if (client === 'singbox' || client === 'hiddify') {
                            const singboxWarpConfigs = await getSingboxConfig(env, host, client, true);
                            return new Response(JSON.stringify(singboxWarpConfigs, null, 4), { 
                                status: 200,
                                headers: {
                                    'Content-Type': 'application/json;charset=utf-8',
                                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                    'Surrogate-Control': 'no-store'
                                }
                            });                            
                        }

                        const warpConfig = await getXrayWarpConfigs(env, client);
                        return new Response(JSON.stringify(warpConfig, null, 4), { 
                            status: 200,
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                                'Surrogate-Control': 'no-store'
                            }
                        });

                    case '/panel':

                        if (typeof env.bpb !== 'object') {
                            const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                        }

                        const pwd = await env.bpb.get('pwd');
                        const isAuth = await Authenticate(request, env); 
                        
                        if (request.method === 'POST') {     
                            if (!isAuth) return new Response('Unauthorized', { status: 401 });
                            const formData = await request.formData();
                            const isReset = formData.get('resetSettings') === 'true';             
                            isReset 
                                ? await updateDataset(env, null, true) 
                                : await updateDataset(env, formData);

                            return new Response('Success', { status: 200 });
                        }
                        
                        if (pwd && !isAuth) return Response.redirect(`${url.origin}/login`, 302);
                        const proxySettings = await env.bpb.get('proxySettings', {type: 'json'});
                        const isUpdated = panelVersion === proxySettings?.panelVersion;
                        if (!proxySettings || !isUpdated) await updateDataset(env);
                        const homePage = await renderHomePage(env, host);

                        return new Response(homePage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin'
                            }
                        });
                                                      
                    case '/login':

                        if (typeof env.bpb !== 'object') {
                            const errorPage = renderErrorPage('KV Dataset is not properly set!', null, true);
                            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
                        }

                        const loginAuth = await Authenticate(request, env);
                        if (loginAuth) return Response.redirect(`${url.origin}/panel`, 302);

                        let secretKey = await env.bpb.get('secretKey');
                        if (!secretKey) {
                            secretKey = generateSecretKey();
                            await env.bpb.put('secretKey', secretKey);
                        }

                        if (request.method === 'POST') {
                            const password = await request.text();
                            const savedPass = await env.bpb.get('pwd');

                            if (password === savedPass) {
                                const jwtToken = generateJWTToken(password, secretKey);
                                const cookieHeader = `jwtToken=${jwtToken}; HttpOnly; Secure; Max-Age=${7 * 24 * 60 * 60}; Path=/; SameSite=Strict`;
                                
                                return new Response('Success', {
                                    status: 200,
                                    headers: {
                                      'Set-Cookie': cookieHeader,
                                      'Content-Type': 'text/plain',
                                    }
                                });        
                            } else {
                                return new Response('Method Not Allowed', { status: 405 });
                            }
                        }
                        
                        const loginPage = await renderLoginPage();

                        return new Response(loginPage, {
                            status: 200,
                            headers: {
                                'Content-Type': 'text/html',
                                'Access-Control-Allow-Origin': url.origin,
                                'Access-Control-Allow-Methods': 'GET, POST',
                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                'X-Content-Type-Options': 'nosniff',
                                'X-Frame-Options': 'DENY',
                                'Referrer-Policy': 'strict-origin-when-cross-origin'
                            }
                        });
                    
                    case '/logout':
                                    
                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain'
                            }
                        });        

                    case '/panel/password':

                        const oldPwd = await env.bpb.get('pwd');
                        let passAuth = await Authenticate(request, env);
                        if (oldPwd && !passAuth) return new Response('Unauthorized!', { status: 401 });           
                        const newPwd = await request.text();
                        if (newPwd === oldPwd) return new Response('Please enter a new Password!', { status: 400 });
                        await env.bpb.put('pwd', newPwd);

                        return new Response('Success', {
                            status: 200,
                            headers: {
                                'Set-Cookie': 'jwtToken=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                                'Content-Type': 'text/plain',
                            }
                        });

                    default:
                        // return new Response('Not found', { status: 404 });
                        url.hostname = 'www.speedtest.net';
                        url.protocol = 'https:';
                        request = new Request(url, request);
                        return await fetch(request);
                }
            } else {
                return url.pathname.startsWith('/tr') ? await trojanOverWSHandler(request) : await vlessOverWSHandler(request);
            }
        } catch (err) {
            /** @type {Error} */ let e = err;
            const errorPage = renderErrorPage('Something went wrong!', e.message.toString(), false);
            return new Response(errorPage, { status: 200, headers: {'Content-Type': 'text/html'}});
        }
    },
};
