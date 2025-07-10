<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Assignment;

class AssignmentCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $assignment;

    /**
     * Create a new message instance.
     */
    public function __construct(Assignment $assignment)
    {
        $this->assignment = $assignment;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Nouvelle assignation de véhicule')
                    ->view('emails.assignment_created'); // ✅ c’est la bonne vue
    }
}
