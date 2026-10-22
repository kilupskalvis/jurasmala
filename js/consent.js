/* Cookie consent and the Meta Pixel. The pixel loads only after "Pieņemt visas"; the choice is
   kept in localStorage under "cookie-consent" ("accepted" or "essential"), the same key the
   previous site used, so returning visitors are not asked again. */
(() => {
  const banner = document.getElementById('consentBanner');
  const accept = document.getElementById('consentAccept');
  const decline = document.getElementById('consentDecline');
  if (!banner || !accept || !decline) return;

  const loadMetaPixel = () => {
    if (window.fbq) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', '634309711849349');
    window.fbq('track', 'PageView');
  };

  let consent = null;
  try { consent = localStorage.getItem('cookie-consent'); } catch { /* private mode */ }
  if (consent === 'accepted') { loadMetaPixel(); return; }
  if (consent === 'essential') return;

  banner.classList.add('active');
  const choose = (value) => {
    try { localStorage.setItem('cookie-consent', value); } catch { /* private mode */ }
    banner.classList.remove('active');
    if (value === 'accepted') loadMetaPixel();
  };
  accept.addEventListener('click', () => choose('accepted'));
  decline.addEventListener('click', () => choose('essential'));
})();
