# Payment Gap Analyzer 

**Payment Gap Analyzer** este o platformă digitală avansată dedicată organizațiilor mici și mijlocii (IMM), concepută pentru a identifica, analiza și raporta discrepanțele salariale de gen. Proiectul oferă un suport decizional bazat pe date, asigurând conformitatea cu **Directiva (UE) 2023/970** privind transparența salarială.

## Funcționalități Principale

* **Import Automat de Date:** Încărcare rapidă a datelor angajaților prin fișiere Excel (format `.xlsx`).
* **Dashboard Interactiv:** Vizualizarea indicatorilor cheie (KPIs) precum media salarială pe gen, departament și nivel de experiență (senioritate).
* **Analiză Comparativă:** Identificarea automată a rolurilor (Job Titles) unde există diferențe salariale nejustificate.
* **Rapoarte de Conformitate:** Generarea de statistici necesare pentru audituri și raportări oficiale conform normelor europene.
* **Sistem de Notificări:** Integrare cu servicii de mail pentru alerte privind inechitățile detectate.

## Arhitectura Tehnică

Aplicația folosește o arhitectură modernă de tip **Microservices/Hybrid Backend**, optimizată pentru procesarea datelor:

### **Frontend**
* **React.js:** Interfață utilizator responsivă, modulară și dinamică.
* **Chart.js:** Biblioteca utilizată pentru randarea graficelor statistice.

### **Backend**
* **Node.js & Express:** Gestionează fluxul principal al aplicației, autentificarea utilizatorilor și managementul fișierelor.
* **Django (Python):** Engine-ul de procesare a datelor, utilizat pentru calculul indicatorilor statistici complexi.

### **Bază de Date & Instrumente**
* **PostgreSQL / SQLite:** Stocarea securizată a datelor organizaționale.
* **Pandas (Python):** Utilizat pentru parsarea, curățarea și analiza datelor din Excel.
* **Nodemailer:** Serviciu pentru expedierea notificărilor automate.

##  Instalare și Configurare

### Pre-cerințe
* Node.js (v14+)
* Python (3.8+)
* npm (sau yarn)

### 1. Clonarea proiectului
```bash
git clone [https://github.com/GabrielaSpiridon/Payment-Gap-Analyzer.git](https://github.com/GabrielaSpiridon/Payment-Gap-Analyzer.git)
cd GustoHub
```
### 2. Configurare Backend Django (Analiza de date)
```bash
# Instalare dependențe Python
pip install django pandas openpyxl
pip install -r requirements.txt

# Migrare bază de date și pornire server
python manage.py migrate
python manage.py runserver
```

### 3. Configurare Backend Node.js & Frontend
```bash
# Instalare dependențe Node
npm install

# Pornire server
node server.js
```
##  Obiectivele Proiectului

Implementarea soluției **Payment Gap Analyzer** vizează atingerea următoarelor obiective strategice și operaționale:

* **Monitorizarea Echității Salariale:** Oferă o imagine clară asupra modului în care sunt remunerați angajații, eliminând subiectivismul din procesul de analiză.
* **Conformitate cu Directivele Europene:** Alinierea organizației la cerințele **Directivei (UE) 2023/970**, pregătind terenul pentru transparența salarială obligatorie.
* **Suport pentru Decizii HR Informate:** Transformă datele brute în indicatori vizuali (KPIs), permițând managerilor să ia decizii bazate pe dovezi, nu pe presupuneri.
* **Transparența Sistemului de Salarizare:** Creșterea încrederii angajaților prin demonstrarea unui angajament ferm față de egalitatea de șanse.
* **Pregătirea pentru Audituri:** Facilitarea generării rapide de rapoarte și statistici solicitate de autorități sau de procesele de audit extern.
* **Accesibilitate pentru IMM-uri:** Furnizarea unui instrument performant, dar ușor de utilizat, care nu necesită infrastructuri IT complexe sau bugete masive.
