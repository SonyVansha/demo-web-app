# Demo Web App

Aplikasi Next.js minimal untuk menguji deploy ke Kubernetes, dengan fokus lolos scan Trivy dan SonarQube.

## Struktur

| Path | Fungsi |
|------|--------|
| `app/page.js` | Halaman utama (menampilkan nama pod dan versi) |
| `app/api/healthz/route.js` | Endpoint health check |
| `next.config.mjs` | Mode standalone, security header, `X-Powered-By` dimatikan |
| `Dockerfile` | Multi-stage, runtime distroless non-root |
| `k8s/` | Manifest Deployment dan Service |
| `sonar-project.properties` | Konfigurasi SonarQube |

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Cek health: http://localhost:3000/api/healthz

## Persiapan sebelum diserahkan ke DevOps

1. Jalankan `npm install` untuk membuat `package-lock.json` (wajib, Dockerfile memakai `npm ci`).
2. Di `package.json`, ganti `latest` dengan versi yang terkunci setelah install.
3. Jalankan `npm audit --omit=dev` dan pastikan tidak ada vulnerability.

## Build image

```bash
docker build -t REGISTRY/demo-web:1.0.0 .
docker push REGISTRY/demo-web:1.0.0
```

Image berjalan di port `8080` sebagai user `65532` (non-root).

## Deploy ke Kubernetes

1. Ganti `REGISTRY/nakiba-web:1.0.0` di `k8s/deployment.yaml` dengan image di registry Anda.
2. Terapkan manifest:

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/nakiba-web
kubectl port-forward svc/nakiba-web 8080:80
```

Buka http://localhost:8080.

## Scan keamanan

Trivy:

```bash
trivy image REGISTRY/demo-web:1.0.0
trivy fs --scanners vuln,secret,misconfig .
trivy config k8s/
```

SonarQube:

```bash
sonar-scanner -Dsonar.host.url=<URL> -Dsonar.token=<TOKEN>
```

## Hardening yang sudah diterapkan

- Runtime `distroless/nodejs22:nonroot` tanpa shell, npm, atau paket OS.
- Container non-root, root filesystem read-only, semua capability di-drop, seccomp `RuntimeDefault`.
- Resource requests/limits dan liveness/readiness probe.
- Token service account tidak di-mount.
- Security header: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

## Catatan

- Jika Trivy menemukan CVE baru pada Next.js atau base image, update versi dependency dan build ulang image.
- Quality Gate SonarQube yang mensyaratkan coverage akan gagal karena belum ada test.
