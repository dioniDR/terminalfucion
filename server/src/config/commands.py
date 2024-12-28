# Comandos básicos del sistema
SYSTEM_COMMANDS = [
    'ls', 'pwd', 'echo', 'cat', 'date'
]

# Comandos de P2
P2_COMMANDS = [
    'ccmd',      # Copiar comando
    'p2',        # Comando principal P2
    'bashrc',    # Editar bashrc
    'cdh',       # Historial de directorios
    'cfa',       # Configurar alias
    'cl'         # Limpiar terminal
]

# Comandos de Terminal Collector
TERMINAL_COLLECTOR_COMMANDS = [
    'terminal_collector.py',
    'code_finder.py',
    'dev_notes.py',
    'qnote.py',
    'clean_pycache.py'
]

# Comandos personalizados/extras
CUSTOM_COMMANDS = [
    # Aquí puedes agregar tus comandos personalizados
]

# Todos los comandos permitidos
ALLOWED_COMMANDS = (
    SYSTEM_COMMANDS +
    P2_COMMANDS +
    TERMINAL_COLLECTOR_COMMANDS +
    CUSTOM_COMMANDS
)

# Mensajes de ayuda para cada tipo de comando
HELP_MESSAGES = {
    'System Commands': {
        'ls': 'List directory contents',
        'pwd': 'Print working directory',
        'echo': 'Display a line of text',
        'cat': 'Concatenate files and print',
        'date': 'Display the current time'
    },
    'P2 Commands': {
        'ccmd': 'Copy command output',
        'p2': 'P2 main command',
        'bashrc': 'Edit bashrc file',
        'cdh': 'Directory history',
        'cfa': 'Configure aliases',
        'cl': 'Clear terminal'
    },
    'Terminal Collector Commands': {
        'terminal_collector.py': 'Collect terminal outputs',
        'code_finder.py': 'Find and replace in code',
        'dev_notes.py': 'Development notes system',
        'qnote.py': 'Quick notes access',
        'clean_pycache.py': 'Clean Python cache'
    }
}

def get_help_text():
    help_text = "Available Commands:\n\n"

    for category, commands in {
        'System Commands': SYSTEM_COMMANDS,
        'P2 Commands': P2_COMMANDS,
        'Terminal Collector Commands': TERMINAL_COLLECTOR_COMMANDS,
        'Custom Commands': CUSTOM_COMMANDS
    }.items():
        if commands:  # Solo mostrar categorías que tienen comandos
            help_text += f"\n{category}:\n"
            for cmd in commands:
                description = HELP_MESSAGES.get(category, {}).get(cmd, 'No description available')
                help_text += f"  - {cmd}: {description}\n"

    return help_text