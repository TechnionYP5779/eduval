const dev = {
  domain: 'e-mon.eu.auth0.com',
  clientId: 'SsRVnDbnXPTGjKvOOmf7sayAMRd2KCdz',
  callbackUrl: 'http://localhost:3000/callback',
  phoneIcon: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwi-utbTv-bhAhVL3aQKHYXVBpcQjRx6BAgBEAU&url=http%3A%2F%2Fwww.stickpng.com%2Fimg%2Felectronics%2Fphone-icons%2Fringing-phone-icon&psig=AOvVaw1PSCW976-zF1AASFpBc9wi&ust=1556118597727319'
}

const prod = {
  domain: 'e-mon.eu.auth0.com',
  clientId: 'SsRVnDbnXPTGjKvOOmf7sayAMRd2KCdz',
  callbackUrl: 'https://teacher.emon-teach.com/callback',
  phoneIcon: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwi-utbTv-bhAhVL3aQKHYXVBpcQjRx6BAgBEAU&url=http%3A%2F%2Fwww.stickpng.com%2Fimg%2Felectronics%2Fphone-icons%2Fringing-phone-icon&psig=AOvVaw1PSCW976-zF1AASFpBc9wi&ust=1556118597727319'
}

export const AUTH_CONFIG = process.env.NODE_ENV === 'production' ? prod : dev;
