/**
 * Unified Seeding Script for Web Admins
 * Project: gatepass-49d43
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin using service account file directly for reliability
const serviceAccountPath = path.resolve(__dirname, '../../backend/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

console.log(`📍 Project ID: ${serviceAccount.project_id}`);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

console.log(`📱 Apps initialized: ${admin.apps.length}`);

const auth = admin.auth();
const db = admin.firestore();

const DEFAULT_PASSWORD = 'Admin@123';

/**
 * Generates a descriptive UID based on name, role, and department.
 */
function generateUID(adminData) {
    const nameSlug = adminData.full_name.toLowerCase().trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    const roleSlug = adminData.role.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const deptSlug = (adminData.department || 'global').toLowerCase().replace(/[^a-z0-9]/g, '_');

    return `${nameSlug}_${roleSlug}_${deptSlug}`.substring(0, 128);
}

const ADMIN_DATA = {
    // ... rest of data
    "web_admins": [
        {
            "uid": "SUEuLI8y8TURRqGI6BYXl7Jvcfo2",
            "email": "principal@gmail.com",
            "full_name": "Campus Principal",
            "role": "principal",
            "status": "Inside",
            "department": "CAMPUS"
        },
        {
            "uid": "ndfH8AgGYcWa4uXdfo3JC0dJ7TP2",
            "email": "faculty@gmail.com",
            "full_name": "Lead Faculty",
            "role": "faculty",
            "status": "Inside",
            "department": "CSE"
        },
        {
            "uid": "qCzxxP6p2PXXHGX1LvUUldp8o1n2",
            "email": "masteradmin@gmail.com",
            "full_name": "Master Admin",
            "role": "admin",
            "status": "Inside",
            "department": "CAMPUS"
        },
        {
            "uid": "vl7p4WaXJzbYxEFKgxRdBDEfcRf2",
            "email": "hod@gmail.com",
            "full_name": "Department HOD",
            "role": "hod",
            "status": "Inside",
            "department": "CSE"
        }
    ],
    "web_admins_CSE": [
        { "uid": "FEQsaCMq6gUgSjQp8zlodjlYAQw2", "full_name": "Principal CSE", "role": "principal", "designation": "Principal", "department": "CSE", "email": "principal.cse@ctgroup.in", "status": "Inside" },
        { "uid": "Ft9bcWIkXtcIbwoydGRBSMmoEP33", "full_name": "HOD CSE", "role": "hod", "designation": "Head of Department", "department": "CSE", "email": "hod.cse@ctgroup.in", "status": "Inside" },
        { "uid": "Q2g2Ei7ROMe7CvONVeEZry146oN2", "full_name": "Faculty CSE", "role": "faculty", "designation": "Senior Faculty", "department": "CSE", "email": "faculty.cse@ctgroup.in", "status": "Inside" },
        { "uid": "Xh7VtUUTDpXICCEHLbf9eBLUaVD2", "email": "masteradmin.cse@ctgroup.in", "role": "master_admin", "department": "CSE", "department_name": "Computer Science Engineering", "full_name": "Master Admin CSE", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "vyggPeNO3QZcV0G5BmsDGvlf3Pi2", "email": "akash.cse@ctgroup.in", "full_name": "Akash Virdi", "role": "faculty", "department": "CSE", "status": "Inside", "dept": "Computer Science" }
    ],
    "web_admins_ECE": [
        { "uid": "MG6nUzJyHRe1sdiMWhUyrPvDrbe2", "full_name": "Principal ECE", "role": "principal", "designation": "Principal", "department": "ECE", "email": "principal.ece@ctgroup.in", "status": "Inside" },
        { "uid": "SVq8hUWZtDVGsXlEcdUmQPfgvC93", "full_name": "HOD ECE", "role": "hod", "designation": "Head of Department", "department": "ECE", "email": "hod.ece@ctgroup.in", "status": "Inside" },
        { "uid": "hsJpSH23iHZNQAfbhsA95aWMfK93", "email": "masteradmin.ece@ctgroup.in", "role": "master_admin", "department": "ECE", "department_name": "Electronics & Communication Engineering", "full_name": "Master Admin ECE", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "oJcGO77HsIgs0RZeu4frnQswky82", "full_name": "Faculty ECE", "role": "faculty", "designation": "Senior Faculty", "department": "ECE", "email": "faculty.ece@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_ME": [
        { "uid": "0tcA66n5olfaTJbfx2sllrpWh4i1", "full_name": "HOD ME", "role": "hod", "designation": "Head of Department", "department": "ME", "email": "hod.me@ctgroup.in", "status": "Inside" },
        { "uid": "TCO3jwvRGCZ9ogAJfEvT06IhKKN2", "full_name": "Principal ME", "role": "principal", "designation": "Principal", "department": "ME", "email": "principal.me@ctgroup.in", "status": "Inside" },
        { "uid": "i7krI9GQ3GRAKcV2rdoAQDysYk12", "full_name": "Faculty ME", "role": "faculty", "designation": "Senior Faculty", "department": "ME", "email": "faculty.me@ctgroup.in", "status": "Inside" },
        { "uid": "nnHFAiyoWYP9AlcIXGjw02LQWnu1", "email": "masteradmin.me@ctgroup.in", "role": "master_admin", "department": "ME", "department_name": "Mechanical Engineering", "full_name": "Master Admin ME", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_CE": [
        { "uid": "4dfTfyOOZxPRpVFco1uBdZm7tJu1", "full_name": "Faculty CE", "role": "faculty", "designation": "Senior Faculty", "department": "CE", "email": "faculty.ce@ctgroup.in", "status": "Inside" },
        { "uid": "9daqbTbfk7PvVKBYPxk4Pd6nLHh1", "full_name": "Principal CE", "role": "principal", "designation": "Principal", "department": "CE", "email": "principal.ce@ctgroup.in", "status": "Inside" },
        { "uid": "J3hEZpRvFISivU9xLqvNirL6UYu1", "full_name": "HOD CE", "role": "hod", "designation": "Head of Department", "department": "CE", "email": "hod.ce@ctgroup.in", "status": "Inside" },
        { "uid": "uU1qy0M80tQ5n4tzHWPlkp7mW4g2", "email": "masteradmin.ce@ctgroup.in", "role": "master_admin", "department": "CE", "department_name": "Civil Engineering", "full_name": "Master Admin CE", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_EE": [
        { "uid": "2m3Is4psMbgO9rWpE9datoTK0Y42", "email": "masteradmin.ee@ctgroup.in", "role": "master_admin", "department": "EE", "department_name": "Electrical Engineering", "full_name": "Master Admin EE", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "ePuZTHseoTRMnmow9hT1BczDNCE3", "full_name": "Faculty EE", "role": "faculty", "designation": "Senior Faculty", "department": "EE", "email": "faculty.ee@ctgroup.in", "status": "Inside" },
        { "uid": "u2UZZgnJ44SiPLsEvY9j7F1xw2x1", "full_name": "HOD EE", "role": "hod", "designation": "Head of Department", "department": "EE", "email": "hod.ee@ctgroup.in", "status": "Inside" },
        { "uid": "zrdpZ408UwggcUR3AdtectjDon42", "full_name": "Principal EE", "role": "principal", "designation": "Principal", "department": "EE", "email": "principal.ee@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_AI_ML": [
        { "uid": "HkOqUOSebif47KDAfyAN5zSPyRi2", "full_name": "HOD AI_ML", "role": "hod", "designation": "Head of Department", "department": "AI_ML", "email": "hod.ai_ml@ctgroup.in", "status": "Inside" },
        { "uid": "URd5Lrcas0hs0rjKvUAM2GtNbbr2", "full_name": "Faculty AI_ML", "role": "faculty", "designation": "Senior Faculty", "department": "AI_ML", "email": "faculty.ai_ml@ctgroup.in", "status": "Inside" },
        { "uid": "mXdLqjzpwwS001UMl9Hfkls7smV2", "full_name": "Principal AI_ML", "role": "principal", "designation": "Principal", "department": "AI_ML", "email": "principal.ai_ml@ctgroup.in", "status": "Inside" },
        { "uid": "yQvaPADtBsV2RKeA4CjQFQ2Z5Wj2", "email": "masteradmin.ai_ml@ctgroup.in", "role": "master_admin", "department": "AI_ML", "department_name": "Artificial Intelligence & Machine Learning Engineering", "full_name": "Master Admin AI_ML", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_BT": [
        { "uid": "8WnmGQEKB4U5N8YULgVylRB3PXK2", "full_name": "HOD BT", "role": "hod", "designation": "Head of Department", "department": "BT", "email": "hod.bt@ctgroup.in", "status": "Inside" },
        { "uid": "DbjGDI1yxvchNz5KHGdMc1lm58m2", "full_name": "Faculty BT", "role": "faculty", "designation": "Senior Faculty", "department": "BT", "email": "faculty.bt@ctgroup.in", "status": "Inside" },
        { "uid": "dD2C1lo9sxfeMBN23CDBaaRB4Da2", "email": "masteradmin.bt@ctgroup.in", "role": "master_admin", "department": "BT", "department_name": "Biotechnology", "full_name": "Master Admin BT", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "lEC3wGPaKwXCakD7b04GZ7n7DNR2", "full_name": "Principal BT", "role": "principal", "designation": "Principal", "department": "BT", "email": "principal.bt@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_APPLIED_SCI": [
        { "uid": "3MsT47yawSMZgwLoJnpBlFmcx8P2", "full_name": "HOD APPLIED_SCI", "role": "hod", "designation": "Head of Department", "department": "APPLIED_SCI", "email": "hod.applied_sci@ctgroup.in", "status": "Inside" },
        { "uid": "hFWTPwOTxyVMrmfmFr42b49xSNM2", "full_name": "Principal APPLIED_SCI", "role": "principal", "designation": "Principal", "department": "APPLIED_SCI", "email": "principal.applied_sci@ctgroup.in", "status": "Inside" },
        { "uid": "nwk56T9IoddAAxcu2mli8F1tKxj2", "full_name": "Faculty APPLIED_SCI", "role": "faculty", "designation": "Senior Faculty", "department": "APPLIED_SCI", "email": "faculty.applied_sci@ctgroup.in", "status": "Inside" },
        { "uid": "sdXcgr0WH0fIX4Nl48eHpRn5ySm1", "email": "masteradmin.applied_sci@ctgroup.in", "role": "master_admin", "department": "APPLIED_SCI", "department_name": "Applied Sciences", "full_name": "Master Admin APPLIED_SCI", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_IOT": [
        { "uid": "62ZDSdgupvaV4JnfEnkZQ333m413", "full_name": "Principal IOT", "role": "principal", "designation": "Principal", "department": "IOT", "email": "principal.iot@ctgroup.in", "status": "Inside" },
        { "uid": "8xuDHfm97aVTrRbNzaP4hwwadf43", "full_name": "Faculty IOT", "role": "faculty", "designation": "Senior Faculty", "department": "IOT", "email": "faculty.iot@ctgroup.in", "status": "Inside" },
        { "uid": "9dPeoWP4m9QF7PtNYmgt4KwooT32", "full_name": "HOD IOT", "role": "hod", "designation": "Head of Department", "department": "IOT", "email": "hod.iot@ctgroup.in", "status": "Inside" },
        { "uid": "PCgaSSVettXEskzW7dLawUvP7Ui1", "email": "masteradmin.iot@ctgroup.in", "role": "master_admin", "department": "IOT", "department_name": "Internet of Things", "full_name": "Master Admin IOT", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_TECH": [
        { "uid": "4Sbsg3bYeFPKwaGgA6D1Ic7lbxv1", "full_name": "HOD TECH", "role": "hod", "designation": "Head of Department", "department": "TECH", "email": "hod.tech@ctgroup.in", "status": "Inside" },
        { "uid": "BfmhacjxpZYhAInoevhn4CGD9yw1", "email": "masteradmin.tech@ctgroup.in", "role": "master_admin", "department": "TECH", "department_name": "Technology", "full_name": "Master Admin TECH", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "DqPOU9eZ3xa9L64sqJThq8WrADi1", "full_name": "Principal TECH", "role": "principal", "designation": "Principal", "department": "TECH", "email": "principal.tech@ctgroup.in", "status": "Inside" },
        { "uid": "RnYg6LfDrHP3RjP8qCpFoSVOBhn1", "full_name": "Faculty TECH", "role": "faculty", "designation": "Senior Faculty", "department": "TECH", "email": "faculty.tech@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_WEB_TECH": [
        { "uid": "Xl5si4QeROgGytU9s1KMP2YKn3k1", "full_name": "Faculty WEB_TECH", "role": "faculty", "designation": "Senior Faculty", "department": "WEB_TECH", "email": "faculty.web_tech@ctgroup.in", "status": "Inside" },
        { "uid": "v30ttNEnYpXhk1eVz8htEGj6nol1", "email": "masteradmin.web_tech@ctgroup.in", "role": "master_admin", "department": "WEB_TECH", "department_name": "Web Technology and Multimedia", "full_name": "Master Admin WEB_TECH", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "wNtyl1QwUTZ5irzBtzICyYMIafX2", "full_name": "Principal WEB_TECH", "role": "principal", "designation": "Principal", "department": "WEB_TECH", "email": "principal.web_tech@ctgroup.in", "status": "Inside" },
        { "uid": "yaiIrkWPCLYRTkGbOKPKOipatcd2", "full_name": "HOD WEB_TECH", "role": "hod", "designation": "Head of Department", "department": "WEB_TECH", "email": "hod.web_tech@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_BM": [
        { "uid": "Vao423Wp98Yf6UXADc8TVCjs62F2", "email": "masteradmin.bm@ctgroup.in", "role": "master_admin", "department": "BM", "department_name": "Business Management", "full_name": "Master Admin BM", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "W10FgRQbBIUjTkQBFA1VVm7eEmR2", "full_name": "Faculty BM", "role": "faculty", "designation": "Senior Faculty", "department": "BM", "email": "faculty.bm@ctgroup.in", "status": "Inside" },
        { "uid": "YjuTMj5whbQNZDV3BDdWpaN6U7L2", "full_name": "HOD BM", "role": "hod", "designation": "Head of Department", "department": "BM", "email": "hod.bm@ctgroup.in", "status": "Inside" },
        { "uid": "juVKm29cZqYVrSiR0lp5Wagdq0Q2", "full_name": "Principal BM", "role": "principal", "designation": "Principal", "department": "BM", "email": "principal.bm@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_ARCH": [
        { "uid": "VasNRovdjTObV1RXipGtLTESZZi2", "email": "masteradmin.arch@ctgroup.in", "role": "master_admin", "department": "ARCH", "department_name": "Architecture", "full_name": "Master Admin ARCH", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "fe7jk2InGmgJLJTWXDePx3MXdvn1", "full_name": "HOD ARCH", "role": "hod", "designation": "Head of Department", "department": "ARCH", "email": "hod.arch@ctgroup.in", "status": "Inside" },
        { "uid": "uqWt0FTFZ5ata2AT8jtpfsRebdL2", "full_name": "Principal ARCH", "role": "principal", "designation": "Principal", "department": "ARCH", "email": "principal.arch@ctgroup.in", "status": "Inside" },
        { "uid": "vti6VIQxG0QlAeEn95AmJ3yGk2S2", "full_name": "Faculty ARCH", "role": "faculty", "designation": "Senior Faculty", "department": "ARCH", "email": "faculty.arch@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_INTERIOR": [
        { "uid": "M812MqIvsdcxfRelXiibQ5qC8MD3", "full_name": "HOD INTERIOR", "role": "hod", "designation": "Head of Department", "department": "INTERIOR", "email": "hod.interior@ctgroup.in", "status": "Inside" },
        { "uid": "PGwxdoZtNOT9AcjZI4QSqGZvvD33", "full_name": "Faculty INTERIOR", "role": "faculty", "designation": "Senior Faculty", "department": "INTERIOR", "email": "faculty.interior@ctgroup.in", "status": "Inside" },
        { "uid": "rcsXMAx8aGdwVI4NtxSxlYT3IVC2", "full_name": "Principal INTERIOR", "role": "principal", "designation": "Principal", "department": "INTERIOR", "email": "principal.interior@ctgroup.in", "status": "Inside" },
        { "uid": "udvObSzqPnZgdrrxmFiQdJSTjXG3", "email": "masteradmin.interior@ctgroup.in", "role": "master_admin", "department": "INTERIOR", "department_name": "Interior Design", "full_name": "Master Admin INTERIOR", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_PHARM": [
        { "uid": "0azXz4aFFdSy03g2sLOBlf78QqA2", "full_name": "Faculty PHARM", "role": "faculty", "designation": "Senior Faculty", "department": "PHARM", "email": "faculty.pharm@ctgroup.in", "status": "Inside" },
        { "uid": "84RenC6aVQWOfaFwQzIZ7RnchwZ2", "full_name": "HOD PHARM", "role": "hod", "designation": "Head of Department", "department": "PHARM", "email": "hod.pharm@ctgroup.in", "status": "Inside" },
        { "uid": "Huw8fKRadwabo64YNcyfGvkwLpE2", "email": "masteradmin.pharm@ctgroup.in", "role": "master_admin", "department": "PHARM", "department_name": "Pharmacy", "full_name": "Master Admin PHARM", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "cPVNl59AADVgRUGH84I5I6pXrQn2", "full_name": "Principal PHARM", "role": "principal", "designation": "Principal", "department": "PHARM", "email": "principal.pharm@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_PHARMA_SCI": [
        { "uid": "888FKqvwNogbi8BXlJ1pztNoXbX2", "email": "masteradmin.pharma_sci@ctgroup.in", "role": "master_admin", "department": "PHARMA_SCI", "department_name": "Pharmaceutical Sciences", "full_name": "Master Admin PHARMA_SCI", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "DIaLpuwYRhcb5dsqwzBzOZOH8On1", "full_name": "Faculty PHARMA_SCI", "role": "faculty", "designation": "Senior Faculty", "department": "PHARMA_SCI", "email": "faculty.pharma_sci@ctgroup.in", "status": "Inside" },
        { "uid": "EjzCJSWPH1WME4rf7rtgiqHXZd23", "full_name": "Principal PHARMA_SCI", "role": "principal", "designation": "Principal", "department": "PHARMA_SCI", "email": "principal.pharma_sci@ctgroup.in", "status": "Inside" },
        { "uid": "hnPn7buVQtTyAfIL1cYfHa1oPRh2", "full_name": "HOD PHARMA_SCI", "role": "hod", "designation": "Head of Department", "department": "PHARMA_SCI", "email": "hod.pharma_sci@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_MED_LAB": [
        { "uid": "0HDlUG84CzXyJXkiWE8113Xiujt2", "full_name": "HOD MED_LAB", "role": "hod", "designation": "Head of Department", "department": "MED_LAB", "email": "hod.med_lab@ctgroup.in", "status": "Inside" },
        { "uid": "Jcmpghh0vHShMWqZMVHPnFC23u52", "full_name": "Principal MED_LAB", "role": "principal", "designation": "Principal", "department": "MED_LAB", "email": "principal.med_lab@ctgroup.in", "status": "Inside" },
        { "uid": "RLFHVUae8EMAPWZluRUznWCONpb2", "email": "masteradmin.med_lab@ctgroup.in", "role": "master_admin", "department": "MED_LAB", "department_name": "Medical Lab Sciences", "full_name": "Master Admin MED_LAB", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "x9cpBrL7bVSROx8VyjgIdXKxuIl1", "full_name": "Faculty MED_LAB", "role": "faculty", "designation": "Senior Faculty", "department": "MED_LAB", "email": "faculty.med_lab@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_PHYSIOTHERAPY": [
        { "uid": "fNGLj7Ezc3duVvXjj8agASm5yAw2", "full_name": "Faculty PHYSIOTHERAPY", "role": "faculty", "designation": "Senior Faculty", "department": "PHYSIOTHERAPY", "email": "faculty.physiotherapy@ctgroup.in", "status": "Inside" },
        { "uid": "ib9WAIoyPpe712FzUPbI7z2csrn1", "email": "masteradmin.physiotherapy@ctgroup.in", "role": "master_admin", "department": "PHYSIOTHERAPY", "department_name": "Physiotherapy", "full_name": "Master Admin PHYSIOTHERAPY", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "n1AV05kffSSNmjp8V60F8PXqfoA3", "full_name": "HOD PHYSIOTHERAPY", "role": "hod", "designation": "Head of Department", "department": "PHYSIOTHERAPY", "email": "hod.physiotherapy@ctgroup.in", "status": "Inside" },
        { "uid": "xX25Z1zF8mhmHkphhUk18hyaSC62", "full_name": "Principal PHYSIOTHERAPY", "role": "principal", "designation": "Principal", "department": "PHYSIOTHERAPY", "email": "principal.physiotherapy@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_LAW": [
        { "uid": "4scRChOv58S6j92D7BTCjZV6m8F3", "full_name": "Principal LAW", "role": "principal", "designation": "Principal", "department": "LAW", "email": "principal.law@ctgroup.in", "status": "Inside" },
        { "uid": "J5gJaeeL9HgZKL55LCw5lXC3o9J3", "full_name": "Faculty LAW", "role": "faculty", "designation": "Senior Faculty", "department": "LAW", "email": "faculty.law@ctgroup.in", "status": "Inside" },
        { "uid": "Ot3eCwkUMUM9RgCrg79OgL1KQuJ2", "full_name": "HOD LAW", "role": "hod", "designation": "Head of Department", "department": "LAW", "email": "hod.law@ctgroup.in", "status": "Inside" },
        { "uid": "wDpR6tHtnuOoiR0LT0BVoFJSL793", "email": "masteradmin.law@ctgroup.in", "role": "master_admin", "department": "LAW", "department_name": "Law", "full_name": "Master Admin LAW", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_HUMANITIES": [
        { "uid": "1XwBudLvs5exk8zBz3Fw1esXjZi2", "full_name": "Faculty HUMANITIES", "role": "faculty", "designation": "Senior Faculty", "department": "HUMANITIES", "email": "faculty.humanities@ctgroup.in", "status": "Inside" },
        { "uid": "am8Xs1VCEdZkPld8ORXQcm9QrfC3", "full_name": "HOD HUMANITIES", "role": "hod", "designation": "Head of Department", "department": "HUMANITIES", "email": "hod.humanities@ctgroup.in", "status": "Inside" },
        { "uid": "x92EYawOfXb03S9jjTOOCTG1V7R2", "email": "masteradmin.humanities@ctgroup.in", "role": "master_admin", "department": "HUMANITIES", "department_name": "Humanities", "full_name": "Master Admin HUMANITIES", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "yiHHEEnnApSotUNj4mgyYQBhgp42", "full_name": "Principal HUMANITIES", "role": "principal", "designation": "Principal", "department": "HUMANITIES", "email": "principal.humanities@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_HOTEL": [
        { "uid": "UHtj2c8sZTMEtNsVFn9ZOkkDTjb2", "full_name": "HOD HOTEL", "role": "hod", "designation": "Head of Department", "department": "HOTEL", "email": "hod.hotel@ctgroup.in", "status": "Inside" },
        { "uid": "UwWjuusXNvRDhG03k671AhmJ8NW2", "full_name": "Faculty HOTEL", "role": "faculty", "designation": "Senior Faculty", "department": "HOTEL", "email": "faculty.hotel@ctgroup.in", "status": "Inside" },
        { "uid": "cbRJ3HkhFVMmW1zl68lIsr0ImJD3", "email": "masteradmin.hotel@ctgroup.in", "role": "master_admin", "department": "HOTEL", "department_name": "Hotel Management", "full_name": "Master Admin HOTEL", "designation": "Department Head Admin", "status": "Inside" },
        { "uid": "jNnrdGCdJ1er17avjqKor3oxXHE3", "full_name": "Principal HOTEL", "role": "principal", "designation": "Principal", "department": "HOTEL", "email": "principal.hotel@ctgroup.in", "status": "Inside" }
    ],
    "web_admins_TOURISM": [
        { "uid": "8UsYVhxMFLQeYQzuYX48zC8JikR2", "full_name": "Principal TOURISM", "role": "principal", "designation": "Principal", "department": "TOURISM", "email": "principal.tourism@ctgroup.in", "status": "Inside" },
        { "uid": "B1XqKqbFyFeR4AXP20JI3i4Mrww2", "full_name": "Faculty TOURISM", "role": "faculty", "designation": "Senior Faculty", "department": "TOURISM", "email": "faculty.tourism@ctgroup.in", "status": "Inside" },
        { "uid": "d1RNOiGKwwWJw48jCwxUvFK0Pz62", "full_name": "HOD TOURISM", "role": "hod", "designation": "Head of Department", "department": "TOURISM", "email": "hod.tourism@ctgroup.in", "status": "Inside" },
        { "uid": "g1HK0EHmmzRa0RD2LkR2Hh1jTev1", "email": "masteradmin.tourism@ctgroup.in", "role": "master_admin", "department": "TOURISM", "department_name": "Tourism", "full_name": "Master Admin TOURISM", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_EDUCATION": [
        { "uid": "11iH251KsMP9yVy2fKYyKJFkqg33", "full_name": "Faculty EDUCATION", "role": "faculty", "designation": "Senior Faculty", "department": "EDUCATION", "email": "faculty.education@ctgroup.in", "status": "Inside" },
        { "uid": "mSP8GLYUTsgI7cD371oWp1JQxYn1", "full_name": "HOD EDUCATION", "role": "hod", "designation": "Head of Department", "department": "EDUCATION", "email": "hod.education@ctgroup.in", "status": "Inside" },
        { "uid": "tBsEMHbEv7WzLsRGxFJmmLJDKxb2", "full_name": "Principal EDUCATION", "role": "principal", "designation": "Principal", "department": "EDUCATION", "email": "principal.education@ctgroup.in", "status": "Inside" },
        { "uid": "xugn2SbbaFcwvgn2X5rc7nP8W7b2", "email": "masteradmin.education@ctgroup.in", "role": "master_admin", "department": "EDUCATION", "department_name": "Education", "full_name": "Master Admin EDUCATION", "designation": "Department Head Admin", "status": "Inside" }
    ],
    "web_admins_MULTIMEDIA": [
        { "uid": "828F1xgVVTY0ANjPlfCGCIaMfgX2", "full_name": "Faculty MULTIMEDIA", "role": "faculty", "designation": "Senior Faculty", "department": "MULTIMEDIA", "email": "faculty.multimedia@ctgroup.in", "status": "Inside" },
        { "uid": "Dn7aUmwuRBM2YRLqfeKHOMeokRj2", "full_name": "HOD MULTIMEDIA", "role": "hod", "designation": "Head of Department", "department": "MULTIMEDIA", "email": "hod.multimedia@ctgroup.in", "status": "Inside" },
        { "uid": "IMRMg3VbakdFTiNzLTy1yik11Hs1", "full_name": "Principal MULTIMEDIA", "role": "principal", "designation": "Principal", "department": "MULTIMEDIA", "email": "principal.multimedia@ctgroup.in", "status": "Inside" },
        { "uid": "tk4hjBJ5fDaLLYBjD4AH4KHoRBq2", "email": "masteradmin.multimedia@ctgroup.in", "role": "master_admin", "department": "MULTIMEDIA", "department_name": "Multimedia", "full_name": "Master Admin MULTIMEDIA", "designation": "Department Head Admin", "status": "Inside" }
    ]
};

async function seedWebAdmins() {
    console.log('🚀 Starting Unified Web Admin Seeding...');

    // Process each collection key in ADMIN_DATA
    for (const collectionKey in ADMIN_DATA) {
        const admins = ADMIN_DATA[collectionKey];
        const targetCollection = collectionKey; // e.g., 'web_admins' or 'web_admins_CSE'

        console.log(`\n📂 Processing collection: ${targetCollection} (${admins.length} entries)`);

        for (const adminData of admins) {
            try {
                // Generate a descriptive UID
                const descriptiveUID = generateUID(adminData);
                console.log(`\n   🔄 User: ${adminData.email} (${adminData.role})...`);
                console.log(`      📍 ID: ${descriptiveUID}`);

                // 1. Create/Update Auth User (Using our descriptive UID)
                try {
                    let userRecord;
                    try {
                        userRecord = await auth.createUser({
                            uid: descriptiveUID,
                            email: adminData.email,
                            password: DEFAULT_PASSWORD,
                            displayName: adminData.full_name
                        });
                        console.log(`      ✅ Auth user created: ${userRecord.uid}`);
                    } catch (error) {
                        if (error.code === 'auth/email-already-exists' || error.code === 'auth/uid-already-exists') {
                            try {
                                userRecord = await auth.getUser(descriptiveUID);
                                await auth.updateUser(userRecord.uid, { password: DEFAULT_PASSWORD, email: adminData.email });
                                console.log(`      ⚠️  Auth user (by UID) updated.`);
                            } catch (innerError) {
                                const existingByEmail = await auth.getUserByEmail(adminData.email);
                                console.log(`      ⚠️  Email exists with different UID (${existingByEmail.uid}). Syncing...`);
                                await auth.deleteUser(existingByEmail.uid);
                                userRecord = await auth.createUser({
                                    uid: descriptiveUID,
                                    email: adminData.email,
                                    password: DEFAULT_PASSWORD,
                                    displayName: adminData.full_name
                                });
                                console.log(`      ✅ Auth user re-created with proper ID.`);
                            }
                        } else {
                            throw error;
                        }
                    }
                } catch (authError) {
                    console.error(`      ❌ Auth Error:`, authError.message);
                    console.log(`      ℹ️  Proceeding with Firestore seeding only...`);
                }

                // 2. Add to designated collection (Using descriptiveUID as document ID)
                const finalData = {
                    ...adminData,
                    uid: descriptiveUID,
                    password: DEFAULT_PASSWORD, // Storing for reference/compatibility as requested
                    status: adminData.status || 'Inside',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                await db.collection(targetCollection).doc(descriptiveUID).set(finalData, { merge: true });
                console.log(`      ✅ Saved to ${targetCollection} (Firestore)`);

                // 3. ALSO add to consolidated 'web_admins' collection if not already there
                if (targetCollection !== 'web_admins') {
                    await db.collection('web_admins').doc(descriptiveUID).set(finalData, { merge: true });
                    console.log(`      ✅ Also saved to unified web_admins (Firestore)`);
                }

            } catch (error) {
                console.error(`      ❌ Error:`, error);
            }
        }
    }

    console.log('\n✨ Seeding process complete!');
    process.exit(0);
}

seedWebAdmins().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
