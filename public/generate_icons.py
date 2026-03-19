from PIL import Image, ImageDraw, ImageFont
import os

# Criar diretório public se não existir
os.makedirs('public', exist_ok=True)

# Cores
orange = '#f97316'
white = '#ffffff'

# Tamanhos
sizes = [192, 512]

for size in sizes:
    # Criar imagem
    img = Image.new('RGB', (size, size), orange)
    draw = ImageDraw.Draw(img)
    
    # Adicionar emoji (burger)
    emoji = "🍔"
    
    # Tamanho da fonte (aproximado)
    font_size = int(size * 0.6)
    
    # Desenhar emoji no centro
    draw.text(
        (size // 2, size // 2),
        emoji,
        fill=white,
        anchor='mm',
        font=None
    )
    
    # Salvar
    filename = f'public/logo-{size}.png'
    img.save(filename, 'PNG')
    print(f'✅ {filename} criado')

print('Ícones gerados com sucesso!')
