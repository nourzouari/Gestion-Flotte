<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\AssignmentCreatedMail;
use App\Models\Assignment;


Route::get('/', function () {
    return response()->json(['message' => 'API Root']);
});



Route::get('/test-mail', function () {
    $assignment = Assignment::first();

    if (!$assignment) {
        return 'Pas d\'assignation trouvée pour le test.';
    }

    Mail::to('nzouari2002@gmail.com')->send(new AssignmentCreatedMail($assignment));
 
    return 'Mail envoyé !';
});