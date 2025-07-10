<!DOCTYPE html>
<html>
<head>
    <title>Nouvelle assignation de véhicule</title>
</head>
<body>
    <h1>Bonjour {{ $assignment->driver->name }},</h1>

    <p>Un nouveau véhicule vous a été assigné :</p>

    <ul>
        <li>Véhicule : {{ $assignment->vehicle->brand }} {{ $assignment->vehicle->model }}</li>
        <li>Du : {{ $assignment->start_date }}</li>
        <li>Au : {{ $assignment->end_date }}</li>
    </ul>

    <p>Merci de prendre note de cette assignation.</p>

    <p>Cordialement,<br>Le service de gestion de flotte</p>
</body>
</html>
