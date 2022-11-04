export const load_sprite = (sprite: string) => {
  const img = new Image();
  img.src = sprite;
  return img;
};
