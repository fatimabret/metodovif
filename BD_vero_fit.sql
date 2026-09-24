CREATE TABLE NIVEL_MEMBRESIA
(
  id_nivel SERIAL,
  descripcion VARCHAR(50) NOT NULL,
  costo DECIMAL(10,2) NOT NULL,
  CONSTRAINT PK_nivel PRIMARY KEY (id_nivel),
  CONSTRAINT CK_costo CHECK (costo > 0)
);

CREATE TABLE USUARIO
(
  id_usuario SERIAL,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  contrasenia VARCHAR(255) NOT NULL,
  extra TEXT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  id_nivel INT NOT NULL,
  CONSTRAINT PK_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT fk_nivel_usuario FOREIGN KEY (id_nivel) REFERENCES NIVEL_MEMBRESIA(id_nivel),
  CONSTRAINT UQ_correo UNIQUE (correo),
  CONSTRAINT CK_usuario_correo CHECK (correo ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]+$'),
  CONSTRAINT CK_usuario_nombre CHECK (TRIM(nombre) <> '')
);

CREATE TABLE CATEGORIA
(
  id_categoria SERIAL,
  descripcion VARCHAR(100) NOT NULL,
  CONSTRAINT PK_categoria PRIMARY KEY (id_categoria)
);

CREATE TABLE EJERCICIO
(
  id_ejercicio SERIAL,
  url VARCHAR(255) NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  id_nivel INT NOT NULL,
  CONSTRAINT PK_ejercicio PRIMARY KEY (id_ejercicio),
  CONSTRAINT FK_nivel_ejercicio FOREIGN KEY (id_nivel) REFERENCES NIVEL_MEMBRESIA(id_nivel),
  CONSTRAINT CK_ejercicio_url CHECK (url LIKE 'http%'),
  CONSTRAINT CK_ejercicio_titulo CHECK (TRIM(titulo) <> '')
);

CREATE TABLE CATEGORIA_EJERCICIO
(
  id_categoria_ejercicio SERIAL,
  id_ejercicio INT NOT NULL,
  id_categoria INT NOT NULL,
  CONSTRAINT PK_categoria_ejercicio PRIMARY KEY (id_categoria_ejercicio),
  CONSTRAINT FK_ejercicio_categoria_ejercicio FOREIGN KEY (id_ejercicio) REFERENCES EJERCICIO(id_ejercicio),
  CONSTRAINT FK_categoria_categoria_ejercicio FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

CREATE TABLE PAGO
(
  id_pago SERIAL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATE NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  comprobante VARCHAR(255) NOT NULL,
  id_usuario INT NOT NULL,
  CONSTRAINT PK_pago PRIMARY KEY (id_pago),
  CONSTRAINT FK_usuario_pago FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario),
  CONSTRAINT CK_monto CHECK (monto > 0),
  CONSTRAINT CK_metodo_pago CHECK (metodo_pago IN ('MercadoPago', 'Transferencia', 'Efectivo', 'Tarjeta'))
);

CREATE TABLE EJERCICIO_FAVORITO
(
  fecha_agregado DATE NOT NULL,
  id_ejercicio INT NOT NULL,
  id_usuario INT NOT NULL,
  CONSTRAINT PK_ejercicio_usuario PRIMARY KEY (id_ejercicio, id_usuario),
  CONSTRAINT FK_ejercicio_ejercicio_usuario FOREIGN KEY (id_ejercicio) REFERENCES EJERCICIO(id_ejercicio),
  CONSTRAINT FK_usuario_ejercicio_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE PERFIL_ENTRENADORA
(
  id_perfil SERIAL,
  nombre VARCHAR(100) NOT NULL,
  biografia VARCHAR(255) NOT NULL,
  url_foto VARCHAR(255) NOT NULL,
  instagram VARCHAR(50) NOT NULL,
  CONSTRAINT PK_perfil PRIMARY KEY (id_perfil)
);