import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../service/email.service';  

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  datos_correos: FormGroup;

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    // Inicializar datos_correos en el constructor
    this.datos_correos = this.fb.group({
      name: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      phone: [''],
      asunto: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // No es necesario inicializar datos_correos 
  }

  envioCorreo(): void {
    if (this.datos_correos.valid) {
      const emailData = {
        to: 'rios.lisandro@gmail.com', 
        subject: this.datos_correos.get('asunto')?.value,
        text: `Nombre: ${this.datos_correos.get('name')?.value}\nCorreo: ${this.datos_correos.get('mail')?.value}\nTeléfono: ${this.datos_correos.get('phone')?.value}\n\nMensaje:\n${this.datos_correos.get('message')?.value}`
      };

      this.emailService.sendEmail(emailData).subscribe(response => {
        console.log('Correo enviado', response);
      }, error => {
        console.error('Error al enviar correo', error);
      });
    } else {
      console.error('Formulario inválido');
    }
  }
}
