"use client";

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

// Nota: react-pdf não suporta todas as fontes do sistema, mas podemos usar as padrão ou carregar externas
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    border: '20px solid #1e1b4b',
  },
  borderInner: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    border: '2px solid #8b5cf6',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  header: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 20,
    color: '#8b5cf6',
    marginBottom: 50,
    letterSpacing: 2,
  },
  presentedTo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userName: {
    fontSize: 32,
    color: '#1e1b4b',
    fontWeight: 'bold',
    marginBottom: 30,
    textDecoration: 'underline',
  },
  body: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: 60,
    paddingHorizontal: 50,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  signatureContainer: {
    alignItems: 'center',
  },
  signatureLine: {
    width: 200,
    borderBottom: '1.5px solid #1e1b4b',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 12,
    color: '#1e1b4b',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    fontSize: 10,
    color: '#999999',
  }
});

const MyDocument = ({ userName, certificateId }: { userName: string, certificateId: string }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.borderInner} />
      
      <Image 
        src="/home/dan/.gemini/antigravity/brain/c1a68b5a-649f-44e5-af3d-3c5d418f1bbc/reibb_logo_certificate_1777008699952.png" 
        style={styles.logo} 
      />
      
      <Text style={styles.header}>Certificado de Conclusão</Text>
      <Text style={styles.subtitle}>LX CLINICAL LEARNING MANAGEMENT SYSTEM</Text>
      
      <Text style={styles.presentedTo}>Este certificado é orgulhosamente apresentado a:</Text>
      <Text style={styles.userName}>{userName}</Text>
      
      <Text style={styles.body}>
        Pela conclusão integral da jornada formativa &quot;Rei Bebê: Do Caos à Sobriedade&quot;, 
        contemplando as 7 trilhas de desenvolvimento emocional, autoconhecimento 
        e ferramentas práticas baseadas na literatura dos Doze Passos.
      </Text>

      <View style={styles.signatureSection}>
        <View style={styles.signatureContainer}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Diretoria de Ensino LX</Text>
        </View>
        <View style={styles.signatureContainer}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureText}>Coordenação Clínica</Text>
        </View>
      </View>

      <Text style={styles.footer}>Identificador Único: REIBB-{certificateId} | Emitido em {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);

import { useMemo, useState, useEffect } from 'react';

export function CertificateGenerator({ userName = "Aluno(a)" }: { userName?: string }) {
  const [certificateId] = useState(() => 
    typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 11).toUpperCase() : "CERT-PENDING"
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {certificateId && (
        <PDFDownloadLink 
          document={<MyDocument userName={userName} certificateId={certificateId} />} 
          fileName={`certificado_reibb_${userName.replace(/\s+/g, '_')}.pdf`}
          className="bg-brand-cyan hover:bg-brand-cyan/80 text-white px-12 py-4 rounded-full font-black text-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center gap-3 border border-white/20"
        >
          {({ loading }) => (loading ? 'Gerando Certificado...' : 'Baixar Certificado Premium')}
        </PDFDownloadLink>
      )}
      <p className="text-gray-500 text-xs">O arquivo PDF será gerado instantaneamente no seu navegador.</p>
    </div>
  );
}
