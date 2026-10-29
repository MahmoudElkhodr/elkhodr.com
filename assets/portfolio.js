(function(){
  var user='m.elkhodr',domain='cqu.edu.au',email=user+'@'+domain,mailto='mai'+'lto:'+email;
  var cta=document.getElementById('email-cta'),text=document.getElementById('email-text'),foot=document.getElementById('email-footer');
  if(cta) cta.href=mailto; if(text) text.textContent=email; if(foot) foot.href=mailto;
  var nav=document.getElementById('mn');
  if(nav) window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>10)});
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)entry.target.classList.add('vis')})},{threshold:.1});
  document.querySelectorAll('.fi').forEach(function(el){observer.observe(el)});
  window.toggleMobileMenu=function(button){var menu=document.querySelector('.nk'),open=menu.classList.toggle('open');button.setAttribute('aria-expanded',open?'true':'false')};
  window.toggleTeachingMenu=function(event){var dd=event.currentTarget.closest('.nd'),open=dd.classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',open?'true':'false')};
  document.addEventListener('click',function(event){document.querySelectorAll('.nd.open').forEach(function(dd){if(!dd.contains(event.target)){dd.classList.remove('open');var button=dd.querySelector('.dtg');if(button)button.setAttribute('aria-expanded','false')}})});
  document.querySelectorAll('.nk a').forEach(function(link){link.addEventListener('click',function(){var menu=document.querySelector('.nk');if(menu){menu.classList.remove('open');var toggle=document.querySelector('.nh');if(toggle)toggle.setAttribute('aria-expanded','false')}document.querySelectorAll('.nd.open').forEach(function(dd){dd.classList.remove('open')})})});
})();
