export function generateMnemonic(strength = 256) {
  // Simplified version - in a real app, use bip39.generateMnemonic()
  const words12 = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'
  ];
  
  const words24 = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident',
    'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire',
    'across', 'act', 'action', 'actor', 'actress', 'actual'
  ];
  
  return strength === 128 ? words12.join(' ') : words24.join(' ');
}

export function generatePrivateKey(mnemonic) {
  // Simplified version - in a real app, use bip39.mnemonicToSeedHex()
  return 'e9873d79c6d87dc0fb6a5778633389f4453213303da61f20bd67fc233aa33262';
}