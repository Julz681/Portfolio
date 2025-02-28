document.addEventListener('DOMContentLoaded', () => {
    setAvatarColorsByInitials();
  });

  const letterColors = {
    A: '#D32F2F',
    B: '#C2185B',
    C: '#7B1FA2',
    D: '#512DA8',
    E: '#1976D2',
    F: '#0288D1',
    G: '#00796B',
    H: '#388E3C',
    I: '#689F38',
    J: '#F57C00',
    K: '#E64A19',
    L: '#5D4037',
    M: '#455A64',
    N: '#263238',
    O: '#D81B60',
    P: '#8E24AA',
    Q: '#673AB7',
    R: '#303F9F',
    S: '#0288D1',
    T: '#0097A7',
    U: '#00796B',
    V: '#388E3C',
    W: '#689F38',
    X: '#F57C00',
    Y: '#E64A19',
    Z: '#5D4037'
};
  
  function setAvatarColorsByInitials() {
    const avatars = document.querySelectorAll('.contact-avatar');
  
    avatars.forEach(avatar => {
      const name = avatar.dataset.name;
      
      const initial = name.trim().charAt(0).toUpperCase();
      
      const color = letterColors[initial] || '#999'; 
      avatar.style.backgroundColor = color;
    });
  }
  