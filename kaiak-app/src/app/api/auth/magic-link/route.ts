import { createServiceClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/url';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? '').trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY no está configurada' },
      { status: 500 }
    );
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${getAppUrl()}/auth/callback` },
  });

  const actionLink = data?.properties?.action_link;
  if (error || !actionLink) {
    return NextResponse.json(
      { error: error?.message ?? 'No se pudo generar el link' },
      { status: 500 }
    );
  }

  const from = process.env.EMAIL_FROM ?? 'KAIAK K21 <onboarding@resend.dev>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Tu acceso a KAIAK K21',
      text: `¡Hola! Tu link de acceso a KAIAK K21 está listo.\n\nEntrá desde este enlace: ${actionLink}\n\nEste link expira en unos minutos y solo puede usarse una vez. Si no lo pediste vos, podés ignorar este correo.`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:32px 16px;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px 24px;text-align:center;">
            <h2 style="margin:0 0 4px;letter-spacing:4px;">KAIAK <span style="color:#e11d48;">K21</span></h2>
            <p style="margin:0 0 24px;font-size:12px;letter-spacing:2px;color:#888;">EL PERFUME QUE CORRE CONTIGO</p>
            <p style="font-size:15px;color:#333;margin:0 0 24px;">¡Hola! 🏃‍♂️ Tu acceso está listo.<br/>Tocá el botón para entrar a tu cuenta:</p>
            <p style="margin:0 0 24px;">
              <a href="${actionLink}" style="display:inline-block;background:#111;color:#fff;padding:14px 32px;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;">INICIAR SESIÓN</a>
            </p>
            <p style="font-size:13px;color:#666;margin:0 0 8px;">¿No te funciona el botón?</p>
            <p style="font-size:13px;margin:0;word-break:break-all;"><a href="${actionLink}" style="color:#111;">${actionLink}</a></p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="font-size:12px;color:#999;margin:0;">Este link expira en unos minutos y solo puede usarse una vez.<br/>Si no pediste este correo, podés ignorarlo.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const message =
      (detail as { message?: string }).message ??
      'No se pudo enviar el email, revisá Resend';
    return NextResponse.json({ error: message, detail }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}