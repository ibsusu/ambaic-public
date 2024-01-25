export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function decodeImage(src: string, flipY?: boolean) {
  return new Promise<ImageBitmap|HTMLImageElement>((resolve) => {
      // Only chrome's implementation of createImageBitmap is fully supported
      const goodBrowser = navigator.userAgent.toLowerCase().includes('chrome') || navigator.userAgent.toLowerCase().includes('gecko');

      if(self !== undefined && !!self.createImageBitmap && goodBrowser){
      // try {
          console.trace('textureloader, try to createImageBitmap :)');
          fetch(src, { mode: 'cors' })
              .then(r => r.blob())
              .then(b => createImageBitmap(b, { imageOrientation: flipY ? 'flipY' : 'none', premultiplyAlpha: 'none' }))
              .then(resolve);
      // }
      // catch(e) {
      }
      else {
          console.trace("textureloader, failed createImageBitmap, using new Image() instead.");
          const img = new Image();

          img.crossOrigin = '';
          img.src = src;
          img.onload = () => resolve(img);
      }
  });
}

const nameList = [
    'Dave',
    'Bill',
    'Sally',
    'Alice',
    'Cameron',
    'BigGuy9000',
    'Poofy34',
    'xxCoolStuffxx',
  ]
  export function getRandomName() {
    return nameList[(Math.floor(Math.random() * 100) % nameList.length)];
  }