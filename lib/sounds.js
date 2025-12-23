export function playSound(type) {
  if (typeof window === 'undefined') return;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'place':
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
      break;
    case 'error':
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.15;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'complete':
      oscillator.frequency.value = 523;
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 659;
        gain2.gain.value = 0.2;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.3);
      }, 150);
      break;
    case 'hint':
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.15;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
      break;
  }
}
