# /tests/test_api.py
import unittest
import requests
import json
import time

# URL base de tu API. Según tu docker-compose.yml, el backend está en el puerto 5000.
BASE_URL = "http://localhost:5000/api"

class TestApiEndpoints(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """
        Este método se ejecuta una vez ANTES de todas las pruebas.
        Lo usamos para preparar datos necesarios, como crear un usuario que debe existir
        para la prueba de email duplicado.
        """
        print("Preparando el entorno de pruebas...")
        
        # Generamos un email único usando el timestamp para evitar conflictos entre ejecuciones
        cls.existing_user_email = f"usuario.existente_{int(time.time())}@email.com"
        cls.user_to_delete_id = None

        user_payload = {
            "nombre": "Usuario Existente",
            "email": cls.existing_user_email,
            "password": "password123",
            "rol": "estudiante"
        }
        
        try:
            # Intentamos crear el usuario que usaremos para la prueba de duplicados
            response = requests.post(f"{BASE_URL}/usuarios/register", json=user_payload)
            if response.status_code != 201:
                 # Si falla, puede que el servidor no esté arriba.
                 raise Exception(f"No se pudo crear el usuario de prueba. Status: {response.status_code}. ¿Está el backend corriendo?")
            print(f"Usuario de prueba '{cls.existing_user_email}' creado exitosamente.")

        except requests.exceptions.ConnectionError:
            raise Exception(f"No se pudo conectar al backend en {BASE_URL}. Por favor, asegúrate de que esté corriendo con 'docker-compose up'.")

    # --- CASOS DE PRUEBA PARA ENDPOINT DE USUARIOS ---

    def test_1_registro_exitoso(self):
        """
        Caso 1.1: Prueba el registro de un usuario nuevo con datos válidos.
        """
        print("\nEjecutando Test 1: Registro Exitoso...")
        unique_email = f"prueba.exitosa_{int(time.time())}@email.com"
        payload = {
            "nombre": "Usuario Prueba",
            "email": unique_email,
            "password": "clave123",
            "rol": "estudiante"
        }
        response = requests.post(f"{BASE_URL}/usuarios/register", json=payload)
        
        # Verificamos que el código de estado sea 201 (Creado)
        self.assertEqual(response.status_code, 201, "El registro de un nuevo usuario debería devolver un status 201.")
        
        print("✓ Test 1 completado exitosamente.")

    def test_2_registro_fallido_email_duplicado(self):
        """
        Caso 1.2: Prueba que el sistema falle si se intenta registrar un email que ya existe.
        """
        print("\nEjecutando Test 2: Registro con Email Duplicado...")
        payload = {
            "nombre": "Otro Usuario",
            "email": self.existing_user_email, # Usamos el email que ya creamos en setUpClass
            "password": "otra-clave",
            "rol": "docente"
        }
        response = requests.post(f"{BASE_URL}/usuarios/register", json=payload)
        
        # Esperamos un código de error 400, según tu código de `usuarios.js`
        self.assertEqual(response.status_code, 400, "Registrar un email duplicado debería devolver un status 400.")
        
        response_data = response.json()
        self.assertIn("error", response_data, "La respuesta de error debe contener una clave 'error'.")
        print(f"✓ Test 2 completado exitosamente (recibido error esperado: {response_data['error']}).")


    # --- CASOS DE PRUEBA PARA ENDPOINT DE ENSAYOS ---

    def test_3_obtener_ensayo_existente(self):
        """
        Caso 2.1: Prueba que se pueda obtener un ensayo usando un ID válido (asumimos que el ID 1 existe).
        """
        print("\nEjecutando Test 3: Obtener Ensayo Existente...")
        ensayo_id = 1
        response = requests.get(f"{BASE_URL}/ensayos/{ensayo_id}")
        
        # Verificamos que el código de estado sea 200 (OK)
        self.assertEqual(response.status_code, 200, f"Se debería poder obtener el ensayo con ID {ensayo_id}.")
        
        response_data = response.json()
        self.assertEqual(response_data['id'], ensayo_id, "El ID del ensayo devuelto debe coincidir con el solicitado.")
        print(f"✓ Test 3 completado exitosamente (obtenido ensayo con ID {response_data['id']}).")

    def test_4_obtener_ensayo_inexistente(self):
        """
        Caso 2.2: Prueba que la API devuelva un error 404 para un ID de ensayo que no existe (valor frontera).
        """
        print("\nEjecutando Test 4: Obtener Ensayo Inexistente...")
        invalid_id = 99999
        response = requests.get(f"{BASE_URL}/ensayos/{invalid_id}")
        
        # Verificamos que el código de estado sea 404 (No Encontrado)
        self.assertEqual(response.status_code, 404, "Solicitar un ensayo con un ID inexistente debería devolver 404.")

        response_data = response.json()
        self.assertIn("error", response_data, "La respuesta de error debe contener una clave 'error'.")
        self.assertEqual(response_data["error"], "Ensayo no encontrado", "El mensaje de error no es el esperado.")
        print("✓ Test 4 completado exitosamente (recibido error 404 esperado).")


if __name__ == '__main__':
    unittest.main()