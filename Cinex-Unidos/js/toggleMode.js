function toggleDarkMode(mode) {
    const body = document.body;
    localStorage.setItem('darkModeNAD', mode);
  
    if (mode === 'light') {
      body.classList.remove('dark-mode');
    } else if (mode === 'dark') {
      body.classList.add('dark-mode');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    }
  }

  const storedDarkMode = localStorage.getItem('darkModeNAD');
  if (storedDarkMode) {
    toggleDarkMode(storedDarkMode);
  }